import React from "react";
import { Typography } from "@mui/material";

const ConfidenceDisplay = ({ confidence }) => {
  const confidencePercentage = (confidence * 100).toFixed(2);
  let color;

  if (confidencePercentage < 50 || isNaN(confidencePercentage) ) {
    color = "#ff3d00";
  } else if (confidencePercentage < 70) {
    color = "#f9a825";
  } else {
    color = "#689f38";
  }

  return (
    <Typography variant="body2" sx={{ marginTop: "1em", color:"#212121" }}>
      Confidence: <span style={{ color, fontWeight:"bold" }}>{confidencePercentage}%</span>
    </Typography>
  );
};

export default ConfidenceDisplay;
