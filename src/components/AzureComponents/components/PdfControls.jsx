import { Button } from "@mui/material";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function PdfControls({
  pageNumber,
  handlePageNumber,
  numPages,
  handleZoomIn,
  handleZoomOut,
}) {
  return (
    <div className="pdf-controls-container">
      <div className="pdf-controls">
        <div className="zoom-controls">
          <IconButton onClick={handleZoomOut}>
            <RemoveIcon style={{ color: "white" }} />
          </IconButton>
          <IconButton onClick={handleZoomIn}>
            <AddIcon style={{ color: "white" }} />
          </IconButton>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            disabled={pageNumber <= 1}
            onClick={() => handlePageNumber("back")}
            style={{ color: "white", borderColor: "#616161" }}
          >
            <NavigateBefore />
          </Button>
          <div
            style={{
              padding: "10px 20px",
              margin: "0 10px",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: 0, color: "#fff" }}>
              Page {pageNumber} of {numPages}
            </p>
          </div>
          <Button
            variant="outlined"
            disabled={pageNumber >= numPages}
            onClick={() => handlePageNumber("forward")}
            style={{ color: "white", borderColor: "#616161" }}
          >
            <NavigateNext />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PdfControls;
