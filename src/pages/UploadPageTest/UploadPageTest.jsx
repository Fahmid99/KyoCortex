import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import Dropzone from "../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadConfirmCard from "../../components/UploadConfirmCard";
import documentService from "../../services/documentService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import keimService from "../../services/keimService";

function UploadPage({ setOnUploadSuccess }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [select1, setSelect1] = useState("");
  const [select2, setSelect2] = useState("");
  const [textField, setTextField] = useState("");
  const [vendors, setVendors] = useState([]);
  const [parentId, setParentId] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [selectedFileType, setSelectedFileType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getVendors = async () => {
      try {
        const response = await keimService.getVendors();
        setVendors(response);
        if (response.length > 0) {
          setParentId(response[0].vendorid);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    getVendors();
  }, []);

  useEffect(() => {
    if (parentId) {
      const getFileTypes = async (parentId) => {
        try {
          const response = await keimService.getFileTypes(parentId);
          setFileTypes(response);
        } catch (error) {
          console.error("Error fetching file types:", error);
        }
      };
      getFileTypes(parentId);
    }
  }, [parentId]);

  console.log(fileTypes)
  console.log(selectedFileType)
  const notify = () =>
    toast.success("Upload Successful!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    const handleFileUpload = async () => {
      if (!isUploaded) return; // Prevent upload if not confirmed
      const formData = new FormData();
      formData.append('file', file);
      const currentDate = new Date().toISOString();
      formData.append('uploadDate', currentDate);
      formData.append('parentId', parentId);
      formData.append('selectedFileType', selectedFileType);
      setButtonLoading(true);
      try {
        await keimService.uploadNewFile(parentId, selectedFileType, formData);
        setOnUploadSuccess(true);
        notify();
        navigate('/document-history');
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setButtonLoading(false);
      }
    };

    
  const handleUploadSuccess = () => {
    setIsUploaded(true);
    setOpenModal(true); // Open the modal on upload success
  };

  const handleModalClose = () => {
    setIsUploaded(false); // Reset isUploaded when modal is closed
    setOpenModal(false);
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
    handleFileUpload();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: `calc(100vh)`,
 
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        maxWidth="800px" // Adjust this value as needed
      >
        <Dropzone
          onUploadSuccess={handleUploadSuccess}
          setFileName={setFileName}
          setFile={setFile}
        />
        <UploadConfirmCard
          isUploaded={isUploaded}
          selectedSkill={selectedSkill}
          fileName={fileName}
          handleFileUpload={handleFileUpload}
          setButtonLoading={setButtonLoading}
          buttonLoading={buttonLoading}
        />
      </Box>
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Confirm Upload</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the following details before confirming the upload.
          </DialogContentText>
          <FormControl fullWidth margin="dense">
            <InputLabel id="vendor-select-label">Vendor</InputLabel>
            <Select
              labelId="vendor-select-label"
              label="Vendor"
              value={select1}
              onChange={(e) => setSelect1(e.target.value)}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.vendorid} value={vendor.vendorname}>
                  {vendor.vendorname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="filetype-select-label">File Type</InputLabel>
            <Select
              labelId="filetype-select-label"
              label="File Type"
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
            >
              {fileTypes.map((fileType) => (
                <MenuItem key={fileType.typeName} value={fileType.typeName}>
                  {fileType.typeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextField
              value={textField}
              onChange={(e) => setTextField(e.target.value)}
              label="File Name"
              fullWidth
              margin="dense"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleModalConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default UploadPage;
