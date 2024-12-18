import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import samplepdf from "./KF153 - Huon IT.pdf";

const UploadModal = ({
  open,
  onClose,
  vendors,
  fileTypes,
  select1,
  setSelect1,
  selectedFileType,
  setSelectedFileType,
  handleModalConfirm,
  documentClasses,
  folders,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="large" fullWidth>
      <DialogTitle>Confirm Upload</DialogTitle>
      <DialogContent sx={{ height: "600px", overflow: "hidden" }}>
        <DialogContentText>
          Please fill in the following details before confirming the upload.
        </DialogContentText>
        <Box
          sx={{ display: "flex", flexDirection: "row", p: 2, height: "100%" }}
        >
          <Box sx={{ flex: 1, mr: 2, height: "100%" }}>
            <iframe
              src={samplepdf}
              width="100%"
              height="100%"
              title="File Preview"
            ></iframe>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <FormControl
                fullWidth
                margin="dense"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#0a9bcd" },
                    "&:hover fieldset": { borderColor: "#0a9bcd" },
                    "&.Mui-focused fieldset": { borderColor: "#0a9bcd" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0a9bcd",
                    "&.Mui-focused": { color: "#0a9bcd" },
                  },
                }}
              >
                <InputLabel id="vendor-select-label">Document Class</InputLabel>

                <Select
                  labelId="vendor-select-label"
                  label="Document Class"
                  value={select1}
                  onChange={(e) => setSelect1(e.target.value)}
                >
                  {documentClasses.map((docClass, index) => (
                    <MenuItem key={index} value={docClass.localName}>
                      {docClass.localName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                margin="dense"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#0a9bcd" },
                    "&:hover fieldset": { borderColor: "#0a9bcd" },
                    "&.Mui-focused fieldset": { borderColor: "#0a9bcd" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0a9bcd",
                    "&.Mui-focused": { color: "#0a9bcd" },
                  },
                }}
              >
                <InputLabel id="filetype-select-label">
                  Choose target folder
                </InputLabel>
                <Select
                  labelId="filetype-select-label"
                  label="Choose target folder"
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
                >
                  {folders.map((folder, index) => (
                    <MenuItem
                      key={index}
                      value={folder.properties["system:folderTitle"].value}
                    >
                      {folder.properties["system:folderTitle"].value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, marginTop: "400px", background: "#0a9bcd" }}
                onClick={handleModalConfirm}
              >
                Analyze Document
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "black" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;
