import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DCPIcon from "../../../assets/DCPLogo.png";

export default function DCPSignInButton({handleDCPSubmit}) {
  const [open, setOpen] = useState(false);
  const [folderPath, setFolderPath] = useState("");

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleSend = () => {
    // Handle the send action here
    console.log("Folder path:", folderPath);
    closeModal();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={
          <img
            src={DCPIcon}
            alt="Microsoft"
            style={{ width: 30, height: 20 }}
          />
        }
        sx={{
          textTransform: "none",
          borderColor: "#eeeeee",
          color: "#0a9bcd",
          marginBottom: "1em",
          width: "80%",
        }}
        onClick={handleDCPSubmit}
      >
        Send to DCP
      </Button>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>Choose Folder Path</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="folder-path-label">Folder Path</InputLabel>
            <Select
              labelId="folder-path-label"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              label="Folder Path"
            >
              <MenuItem value="/path/to/folder1">/path/to/folder1</MenuItem>
              <MenuItem value="/path/to/folder2">/path/to/folder2</MenuItem>
              <MenuItem value="/path/to/folder3">/path/to/folder3</MenuItem>
              <MenuItem value="/path/to/folder4">
                /path/to/folder4
                <Select
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  displayEmpty
                  renderValue={() => "Subfolders"}
                  sx={{ ml: 2, mt: 1 }}
                >
                  <MenuItem value="/path/to/folder4/subfolder1">
                    /path/to/folder4/subfolder1
                  </MenuItem>
                  <MenuItem value="/path/to/folder4/subfolder2">
                    /path/to/folder4/subfolder2
                  </MenuItem>
                  <MenuItem value="/path/to/folder4/subfolder3">
                    /path/to/folder4/subfolder3
                  </MenuItem>
                </Select>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
