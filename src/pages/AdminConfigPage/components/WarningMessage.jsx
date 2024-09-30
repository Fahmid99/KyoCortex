import React from "react";
import { Typography, Box } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
function WarningMessage({ message }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        background: "#ffcdd2",
        borderRadius: "5px",
        padding: "0.5em",
        margin: "0.5em",
      }}
    >
      <WarningIcon sx={{ color: "#e53935", marginRight: "5px" }} />
      <Typography variant="caption" color="#d50000" fontWeight="bold">
        {message}
      </Typography>
    </Box>
  );
}

export default WarningMessage;
