import { useState, useEffect, useRef } from "react";
import Pdf from "./Pdf";
import { pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Card from "@mui/material/Card"; // Import Card component

import PdfControls from "./PdfControls";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfViewer = ({
  handleSubmit,
  base64String,
  documentData,
  formValues,
  selectedKey,
  setSelectedKey,
  setFormValues,
  convertPolygon,
  canvasRef,
  convertInchesToPixels,
  region,
  setAutoFormValues,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const translateValue = ((1 - scale) / 2) * 100;


  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale((containerWidth * 0.7) / containerWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
  };

  const handlePageNumber = (action) => {
    if (action === "back") {
      setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    } else {
      setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
    }
  };

  console.log(documentData);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#525659",
        position: "relative",
    
      }}
    >
      <PdfControls
        pageNumber={pageNumber}
        handlePageNumber={handlePageNumber}
        numPages={numPages}
        handleSubmit={handleSubmit}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "scroll",
          padding: "10px",
        }}
      >
        <Card
          elevation={3}
          style={{
            overflow: "visible",
            marginTop: "3em",
            transform: `scale(${scale})`,
            transformOrigin: " top",
            margin: "auto",
          }}
        >
          <Pdf
            base64String={base64String}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            pageNumber={pageNumber}
            documentData={documentData}
            formValues={formValues}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            setFormValues={setFormValues}
            convertPolygon={convertPolygon}
            canvasRef={canvasRef}
            convertInchesToPixels={convertInchesToPixels}
            region={region}
            setAutoFormValues={setAutoFormValues}
            scale={scale}
          />
        </Card>
      </div>
    </div>
  );
};

export default PdfViewer;
