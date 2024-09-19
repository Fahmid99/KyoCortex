import {
  Button,
  Stack,
  Typography,
  Divider,
  ButtonGroup,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { useState } from "react";

function Toolbar({ region, setRegion, documentData, handleSubmit }) {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonName, regionData) => {
    setSelectedButton(buttonName);
    setRegion(regionData);
  };

  return (
    <div>
      <Grid container spacing={2} >
        <Grid size={12}>
          <Typography variant="h6">Selection Tools</Typography>
          <Divider sx={{ width: "100%", my: 1 }} />
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <ButtonGroup orientation="horizontal" sx={{color:"rgb(48, 55, 65)"}}>
              <Button
                size="small"
                onClick={() => handleButtonClick("onClickIndex", null)}
                sx={{
                  backgroundColor:
                    selectedButton === "onClickIndex" ? "blue" : "white",
                }}
              >
                <Stack direction="column" alignItems="center">
                  <AdsClickIcon />
                  <Typography variant="caption" sx={{ fontSize: "12px" }}>
                    On Click Index
                  </Typography>
                </Stack>
              </Button>
              <Button
                size="small"
                onClick={() => handleButtonClick("dragAndIndex", null)}
                sx={{
                  backgroundColor:
                    selectedButton === "dragAndIndex" ? "#2196f3" : "white",
                }}
              >
                <Stack direction="column" alignItems="center">
                  <HighlightAltIcon />
                  <Typography variant="caption" sx={{ fontSize: "12px" }}>
                    Drag and Index
                  </Typography>
                </Stack>
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>

        <Grid size={12}>
          <Typography variant="h6">Highlight View</Typography>
          <Divider sx={{ width: "100%", my: 1 }} />
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <ButtonGroup orientation="horizontal">
              <Button
                onClick={() =>
                  handleButtonClick("words", documentData.pages[0].words)
                }
                sx={{
                  backgroundColor:
                    selectedButton === "words" ? "#2196f3" : "white",
                  color: selectedButton === "words" && "white",
                }}
              >
                <Typography sx={{ fontSize: "10px" }}>Words</Typography>
              </Button>
              <Button
                onClick={() =>
                  handleButtonClick("lines", documentData.pages[0].lines)
                }
                sx={{
                  backgroundColor:
                    selectedButton === "lines" ? "#2196f3" : "white",
                  color: selectedButton === "lines" && "white",
                }}
              >
                <Typography sx={{ fontSize: "10px" }}>Lines</Typography>
              </Button>
              {documentData.keyValuePairs.length > 0 && (
                <Button
                  onClick={() =>
                    handleButtonClick(
                      "keyValuePairs",
                      documentData.keyValuePairs
                    )
                  }
                  sx={{
                    backgroundColor:
                      selectedButton === "keyValuePairs" ? "#2196f3" : "white",
                    color: selectedButton === "keyValuePairs" && "white",
                  }}
                >
                  <Typography sx={{ fontSize: "10px" }}>
                    Key Value Pairs
                  </Typography>
                </Button>
              )}
              <Button
                onClick={() =>
                  handleButtonClick("paragraphs", documentData.paragraphs)
                }
                sx={{
                  backgroundColor:
                    selectedButton === "paragraphs" ? "#2196f3" : "white",
                  color: selectedButton === "paragraphs" && "white",
                }}
              >
                <Typography sx={{ fontSize: "10px" }}>Paragraphs</Typography>
              </Button>
              {documentData.documents.length > 0 && (
                <Button
                  onClick={() =>
                    handleButtonClick("documents", documentData.documents)
                  }
                  sx={{
                    backgroundColor:
                      selectedButton === "documents" ? "#2196f3" : "white",
                    color: selectedButton === "documents" && "white",
                  }}
                >
                  <Typography sx={{ fontSize: "12px" }}>Other</Typography>
                </Button>
              )}
            </ButtonGroup>{" "}
          </Box>
        </Grid>
        <Grid size={12}>
          <Typography variant="h6">Actions</Typography>
          <Divider sx={{ width: "100%", my: 1 }} />
          <Box display="flex" justifyContent="center" marginTop="10px">
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: "0", boxShadow: "none" }}
              onClick={handleSubmit}
            >
              Submit Data
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Toolbar;
