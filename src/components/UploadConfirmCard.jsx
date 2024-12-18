import React from "react";
import DocumentIcon from "../assets/document.png";
import DocumentBeforeIcon from "../assets/documentbefore.png";
import InfoIcon from "@mui/icons-material/Info";
import LoadingButton from "@mui/lab/LoadingButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

function UploadProcessCard({
  isUploaded,
  selectedSkill,
  handleSkillChange,
  fileName,
  handleFileUpload,
  buttonloading,
  setButtonLoading,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        height: "auto",
        padding: "2em",
        margin: "1em",
        borderRadius: "10px",
        boxShadow: "none",
        border: "1px solid #e0e0e0",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <InfoIcon style={{ fontSize: 40, color: "#0a9bcd" }} />
            </Grid>
            <Grid item>
              {isUploaded ? (
                <Typography>Confirm Upload</Typography>
              ) : (
                <Typography>Upload a file first</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {isUploaded ? (
            <img src={DocumentIcon} loading="lazy" style={{ width: "90px", height: "auto" }} />
          ) : (
            <img
              src={DocumentBeforeIcon}
              style={{ width: "90px", height: "auto" }}
            />
          )}
        </Grid>
        <Grid item>
          <Typography>{fileName}</Typography>
        </Grid>
        <Grid item>
          <LoadingButton
            disabled={!isUploaded}
            variant="contained"
            sx={{ boxShadow: "none" }}
            onClick={handleFileUpload}
            loading={buttonloading}
            loadingPosition="end"
            endIcon={<CloudUploadIcon />}
          >
            Upload
          </LoadingButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UploadProcessCard;
