import {
  Button,
  Stack,
  Typography,
  Divider,
  ButtonGroup,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SharepointIcon from "../../../assets/sharepoint_logo.svg";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CogIcon from "../../../assets/cog-logo.svg";
import KeimIcon from "../../../assets/keimlogo.png";
import { useState } from "react";

function Toolbar({
  region,
  setRegion,
  documentData,
  handleSubmit,
  selectedKey,
  selectedValue,
  pageNumber,
  selectedButton,
  setSelectedButton,
}) {
  const handleButtonClick = (buttonName, regionData) => {
    setSelectedButton(buttonName);
    setRegion(regionData);
  };

  const handleSharepoint = () => {
    window.open('https://kyoceradocumentsolution.sharepoint.com/teams/dis/Shared%20Documents/Forms/AllItems.aspx?newTargetListUrl=%2Fteams%2Fdis%2FShared%20Documents&viewpath=%2Fteams%2Fdis%2FShared%20Documents%2FForms%2FAllItems%2Easpx&id=%2Fteams%2Fdis%2FShared%20Documents%2FSupplier%20Form&viewid=bc2c4aed%2Dd4b1%2D431b%2Daa40%2D02947e4d343b', '_blank');
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ margin: "1em 0 0 0" }}>
          <Typography variant="h6" marginLeft="0.5em">
            Selection Mode
          </Typography>
          <Divider sx={{ width: "100%", my: 1 }} />
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            marginTop={"1em"}
          >
            <ButtonGroup
              orientation="horizontal"
              sx={{
                "& .MuiButton-root": {
                  borderColor: "#eeeeee",
                },
              }}
            >
              <Button
                size="small"
                // onClick={() => handleButtonClick("onClickIndex", null)}
                sx={{
                  backgroundColor:
                    selectedButton === "onClickIndex" ? "white" : "#2196f3",
                  color: selectedButton === "onClickIndex" ? "black" : "white",
                  padding: "0.5em",
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
                disabled
                sx={{
                  backgroundColor:
                    selectedButton === "dragAndIndex" ? "#2196f3" : "white",
                  color: selectedButton === "dragAndIndex" ? "white" : "black",
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
          <Stack direction="column" alignItems="center">
            <Box mt={2}>
              <TableContainer
                sx={{ border: "1px solid #eeeeee", maxWidth: "350px" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Current Selected</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Key</TableCell>
                      <TableCell>{selectedKey}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Value</TableCell>
                      <TableCell sx={{ color: "#2196f3" }}>
                        {selectedValue}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        </Grid>

        <Grid size={12} sx={{ margin: "1em 0 0 0" }}>
          <Typography variant="h6" marginLeft="0.5em">
            View Mode
          </Typography>
          <Divider sx={{ width: "100%", my: 1 }} />
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            marginTop={"1em"}
          >
            <ButtonGroup
              orientation="vertical"
              sx={{
                width: "90%",
                borderColor: "black",
                "& .MuiButton-root": {
                  borderColor: "#eeeeee",
                },
              }}
            >
              <Button
                onClick={() =>
                  handleButtonClick(
                    "words",
                    documentData.pages[pageNumber - 1].words
                  )
                }
                sx={{
                  backgroundColor:
                    selectedButton === "words" ? "#2196f3" : "white",
                  color: selectedButton === "words" ? "white" : "black",
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>Words</Typography>
              </Button>
              <Button
                onClick={() =>
                  handleButtonClick(
                    "lines",
                    documentData.pages[pageNumber - 1].lines
                  )
                }
                sx={{
                  backgroundColor:
                    selectedButton === "lines" ? "#2196f3" : "white",
                  color: selectedButton === "lines" ? "white" : "black",
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>Lines</Typography>
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
                    color:
                      selectedButton === "keyValuePairs" ? "white" : "black",
                  }}
                >
                  <Typography sx={{ fontSize: "14px" }}>
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
                  color: selectedButton === "paragraphs" ? "white" : "black",
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>Paragraphs</Typography>
              </Button>
              {documentData.documents.length > 0 && (
                <Button
                  onClick={() =>
                    handleButtonClick("documents", documentData.documents)
                  }
                  sx={{
                    backgroundColor:
                      selectedButton === "documents" ? "#2196f3" : "white",
                    color: selectedButton === "documents" ? "white" : "black",
                  }}
                >
                  <Typography sx={{ fontSize: "12px" }}>Other</Typography>
                </Button>
              )}
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid size={12} sx={{ margin: "1em 0 0 0" }}>
          <Typography variant="h6" marginLeft="0.5em">
            Actions
          </Typography>
          <Divider sx={{ width: "100%", my: 1 }} />
          <Box display="flex" justifyContent="center" marginTop="10px">
          <Button
              variant="outlined"
              startIcon={
                <img
                  src={KeimIcon}
                  alt="Microsoft"
                  style={{ width: 30, height: 30 }}
                />
              }
              sx={{
                textTransform: "none",
                borderColor: "#eeeeee",
                color: "#0078D4",
                marginBottom: "1em",
                width: "80%",
              }}
              onClick={handleSubmit}
            >
              Send to KEIM
            </Button>
          </Box>

          <Box display="flex" justifyContent="center" marginTop="10px">
            <Button
              variant="outlined"
              startIcon={
                <img
                  src={SharepointIcon}
                  alt="Microsoft"
                  style={{ width: 20, height: 20 }}
                />
              }
              sx={{
                textTransform: "none",
                borderColor: "#eeeeee",
                color: "#0078D4",
                marginBottom: "1em",
                width: "80%",
              }}
              onClick={handleSharepoint}
            >
             Send to SharePoint
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" marginTop="10px">
            <Button
              variant="outlined"
              startIcon={
                <img
                  src={CogIcon}
                  alt="Microsoft"
                  style={{ width: 20, height: 20 }}
                />
              }
              sx={{
                textTransform: "none",
                borderColor: "#eeeeee",
                color: "#0078D4",
                marginBottom: "1em",
                width: "80%",
              }}
              onClick={handleSharepoint}
            >
             Send to custom location
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Toolbar;
