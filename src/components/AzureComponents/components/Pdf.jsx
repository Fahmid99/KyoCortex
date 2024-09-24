import { useRef, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function Pdf({
  base64String,
  onDocumentLoadSuccess,
  pageNumber,
  scale,
  documentData,
  selectedKey,
  region,
  setAutoFormValues,
  selectedKeyPolygon,
  selectedValuePolygon,
}) {
  const canvasRef = useRef(null);
  console.log(selectedKeyPolygon);

  const convertInchesToPixels = (inches, dpi = 96) => inches * dpi;
  const widthInPixels = convertInchesToPixels(documentData.pageWidth);
  const heightInPixels = convertInchesToPixels(documentData.pageHeight);

  const convertPolygon = (polygon, dpi) => {
    return polygon.map((point) => ({
      x: convertInchesToPixels(point.x, dpi),
      y: convertInchesToPixels(point.y, dpi),
    }));
  };

  const isPointInPolygon = (point, polygon) => {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  };

  const drawBoundingRegions = (
    convertPolygon,
    canvasRef,
    region,
    fillStyle,
    selectedKeyPolygon,
    selectedValuePolygon,
    dpi = 96
  ) => {
    if (!canvasRef.current || !region) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = (bounds, color, lineWidth = 3, fill = fillStyle) => {
      const convertedPolygon = convertPolygon(bounds, dpi);
      ctx.beginPath();
      convertedPolygon.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.lineWidth = lineWidth;

      ctx.fill();
      ctx.stroke();
    };

    const highlightPolygon = (polygon, color) => {
      if (polygon) {
        draw(polygon, color, 4, "rgba(227, 242, 253, 0.3)"); // Thicker border and light blue background for highlighted polygons
      }
    };

    // Draw the selected view
    if (region && Array.isArray(region) && pageNumber !== 3) {
      if (
        region === documentData.pages[pageNumber - 1].words ||
        region === documentData.pages[pageNumber - 1].lines
      ) {
        region.forEach((word) => {
          const bounds = word.polygon;
          if (bounds) {
            draw(bounds, "#ffa726");
          }
        });
      } else if (region === documentData.paragraphs) {
        region.forEach((regions) => {
          regions.boundingRegions.forEach((bound) => {
            const bounds = bound.polygon;
            draw(bounds, selectedKeyPolygon ? "#ffa726" : regions.color);
          });
        });
      } else if (region === documentData.documents) {
        region[0].fields.forEach((field) => {
          if (field.boundingRegions) {
            field.boundingRegions.forEach((bound) => {
              const bounds = bound.polygon;
              draw(bounds, selectedKeyPolygon ? "#ffa726" : field.color);
            });
          }
        });
      } else if  (region === documentData.keyValuePairs) {
        region.forEach((regions) => {
          regions.valueBoundingRegions.forEach((bound) => {
            if (bound.pageNumber === pageNumber) {
              const bounds = bound.polygon;
              draw(bounds, selectedKeyPolygon ? "#ffa726" : regions.color);
            }
          });
          regions.keyBoundingRegions.forEach((bound) => {
            if (bound.pageNumber === pageNumber) {
              const bounds = bound.polygon;
              draw(bounds, selectedKeyPolygon ? "#ffa726" : regions.color);
            }
          });
        });
      }
    } else {
      // Clear the region if none of the conditions are met
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Highlight selected polygons
    highlightPolygon(selectedKeyPolygon, "#2979ff");
    highlightPolygon(selectedValuePolygon, "#2979ff");
  };

  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [newValue, setNewValue] = useState("");
  const [oldValue, setOldValue] = useState("");

  const handleClickOpen = (newVal, oldVal) => {
    setNewValue(newVal);
    setOldValue(oldVal);
    setDialogContent(`New Value: ${newVal}`);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setAutoFormValues((prevValues) => ({
      ...prevValues,
      [selectedKey]: {
        ...prevValues[selectedKey],
        value: newValue,
      },
    }));
    setOpen(false);
  };

  const handleCanvasClick = (event) => {
    console.log("Canvas clicked");

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;
    console.log(scale);
    console.log(`Click coordinates: (${x}, ${y})`);

    const dpi = 96;
    let clickedInRegion = false;

    console.log(selectedKey);
    if (region && Array.isArray(region)) {
      if (
        region === documentData.pages[pageNumber - 1].words ||
        region === documentData.pages[pageNumber - 1].lines
      ) {
        region.forEach((region) => {
          const convertedPolygon = convertPolygon(region.polygon, dpi);

          if (isPointInPolygon({ x, y }, convertedPolygon)) {
            console.log(region.content);
            handleClickOpen(
              region.content,
              documentData[selectedKey]?.value || ""
            );
            clickedInRegion = true;
          }
        });
      } else {
        documentData.keyValuePairs.forEach((regions) => {
          regions.valueBoundingRegions.forEach((bound) => {
            if (bound.pageNumber === pageNumber) {
              const convertedPolygon = convertPolygon(bound.polygon, dpi);

              if (isPointInPolygon({ x, y }, convertedPolygon)) {
                console.log(regions.value);
                handleClickOpen(
                  regions.value,
                  documentData[selectedKey]?.value || ""
                );
                clickedInRegion = true;
              }
            }
          });
        });
      }
    }

    if (!clickedInRegion) {
      handleClickOpen("", "Clicked outside any region");
    }
  };

  useEffect(() => {
    drawBoundingRegions(
      convertPolygon,
      canvasRef,
      region,
      "rgba(255, 183, 77, 0.3)", // Default fill style
      selectedKeyPolygon,
      selectedValuePolygon,
      96
    );
  }, [pageNumber, region, selectedKeyPolygon, selectedValuePolygon]);

  useEffect(() => {
    drawBoundingRegions(
      convertPolygon,
      canvasRef,
      region,
      "rgba(255, 183, 77, 0.3)", // Default fill style
      selectedKeyPolygon,
      selectedValuePolygon,
      96
    );
  }, [pageNumber]);

  return (
    <div
      style={{
        position: "relative",
        width: `${widthInPixels}px`,
        height: `${heightInPixels}px`,
      }}
    >
      <Document file={base64String} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          width={widthInPixels}
          height={heightInPixels}
          onClick={handleCanvasClick}
          renderMode="canvas"
        />
      </Document>
      <canvas
        ref={canvasRef}
        width={widthInPixels}
        height={heightInPixels}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to replace?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Pdf;
