import { useRef } from "react";
import { Document, Page } from "react-pdf";

function Pdf({
  base64String,
  onDocumentLoadSuccess,
  pageNumber,
  scale,
  documentData,
  selectedKey,
  region,
  setAutoFormValues,
}) {
  const canvasRef = useRef(null);

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

  const useDrawBoundingRegions = (
    convertPolygon,
    canvasRef,
    region,
    fillStyle,
    dpi = 96
  ) => {
    if (!canvasRef.current || !region) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = (bounds, color) => {
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
      ctx.fillStyle = fillStyle;
      ctx.lineWidth = 4;
      ctx.fill();
      ctx.stroke();
    };

    if (
      region === documentData.pages[0].words ||
      region === documentData.pages[0].lines
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
          draw(bounds, regions.color);
        });
      });
    } else if (region === documentData.documents) {
      console.log(region);
      region[0].fields.forEach((field) => {
        if (field.boundingRegions) {
          field.boundingRegions.forEach((bound) => {
            const bounds = bound.polygon;
            draw(bounds, field.color);
          });
        }
      });
    } else {
      region.forEach((regions) => {
        regions.valueBoundingRegions.forEach((bound) => {
          const bounds = bound.polygon;
          draw(bounds, regions.color);
        });
      });
      region.forEach((regions) => {
        regions.keyBoundingRegions.forEach((bound) => {
          const bounds = bound.polygon;
          draw(bounds, regions.color);
        });
      });
    }
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

    if (
      region === documentData.pages[0].words ||
      region === documentData.pages[0].lines
    ) {
      region.forEach((region) => {
        const convertedPolygon = convertPolygon(region.polygon, dpi);

        if (isPointInPolygon({ x, y }, convertedPolygon)) {
          console.log(region.content);
          setAutoFormValues((prevValues) => ({
            ...prevValues,
            [selectedKey]: {
              ...prevValues[selectedKey],
              value: region.content,
            },
          }));

          alert(`Clicked on region with lines: ${region.content}`);
          clickedInRegion = true;
        }
      });
    } else {
      documentData.keyValuePairs.forEach((regions) => {
        regions.valueBoundingRegions.forEach((bound) => {
          const convertedPolygon = convertPolygon(bound.polygon, dpi);

          if (isPointInPolygon({ x, y }, convertedPolygon)) {
            console.log(regions.value);
            setAutoFormValues((prevValues) => ({
              ...prevValues,
              [selectedKey]: {
                ...prevValues[selectedKey],
                value: regions.value,
              },
            }));
            alert(`Clicked on region with key: ${regions.value}`);
            clickedInRegion = true;
          }
        });
      });
    }

    if (!clickedInRegion) {
      alert("Clicked outside any region");
    }
  };

  useDrawBoundingRegions(
    convertPolygon,
    canvasRef,
    region,
    "rgba(255, 183, 77, 0.3)",
    96
  );

  return (
    <div
      style={{
        position: "relative",
        width: `${widthInPixels}px`,
        height: `${heightInPixels}px`,
        overflow: "auto",
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
    </div>
  );
}

export default Pdf;
