import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const JsonDisplay = ({ documentData }) => {

 
  const jsonString = JSON.stringify(documentData, null, 2);

  return (
    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "#f5f5f5", margin:"10px" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        JSON Data
      </Typography>
      <Box sx={{ height: "60vh", overflow: "auto", mb: 2 }}>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {jsonString}
        </pre>
      </Box>
      <CopyToClipboard text={jsonString}>
        <Button variant="contained" startIcon={<ContentCopyIcon />}>
          Copy to Clipboard
        </Button>
      </CopyToClipboard>
    </Box>
  );
};

export default JsonDisplay;
