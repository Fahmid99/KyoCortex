import {
  Button,
  Stack,
  Typography,
  Divider,
  ButtonGroup,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import HomeIcon from "@mui/icons-material/Home"; // Replace with your desired icon
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import { useState } from "react";

function Toolbar({ region, setRegion, documentData }) {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonName, regionData) => {
    setSelectedButton(buttonName);
    setRegion(regionData);
  };

  return (
    <div>
      <Grid display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Typography variant="h6">Selection Tools</Typography>
        <ButtonGroup orientation="horizontal">
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
              <Typography variant="caption">On Click Index</Typography>
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
              <Typography variant="caption">Drag and Index</Typography>
            </Stack>
          </Button>
        </ButtonGroup>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Typography variant="h6">Highlight View</Typography>
        <Divider/>
        <ButtonGroup orientation="vertical">
          <Button
            onClick={() =>
              handleButtonClick("words", documentData.pages[0].words)
            }
            sx={{
              backgroundColor: selectedButton === "words" ? "#2196f3" : "white",
              color: selectedButton === "words" && "white",
            }}
          >
            Words
          </Button>
          <Button
            onClick={() =>
              handleButtonClick("lines", documentData.pages[0].lines)
            }
            sx={{
              backgroundColor: selectedButton === "lines" ? "#2196f3" : "white",
              color: selectedButton === "lines" && "white" 
            }}
          >
            Lines
          </Button>
          {documentData.keyValuePairs.length > 0 && (
            <Button
              onClick={() =>
                handleButtonClick("keyValuePairs", documentData.keyValuePairs)
              }
              sx={{
                backgroundColor:
                  selectedButton === "keyValuePairs" ? "#2196f3" : "white",
                  color: selectedButton === "keyValuePairs" && "white" ,
              }}

            >
              Key Value Pairs
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
            Paragraphs
          </Button>
          {documentData.documents.length > 0 && (
            <Button
              onClick={() =>
                handleButtonClick("documents", documentData.documents)
              }
              sx={{
                backgroundColor:
                  selectedButton === "documents" ? "#2196f3" : "white",
                  color: selectedButton === "documents" && "white" ,
              }}
            >
              Other
            </Button>
          )}
        </ButtonGroup>
      </Grid>
      <Box marginTop={"10px"}>
        <Typography variant="h6">Actions</Typography>
        <Divider />
        <Box display="flex" justifyContent="center" marginTop="10px">
          <Button variant="contained">Send to KIEM</Button>
        </Box>
      </Box>
    </div>
  );
}

export default Toolbar;
