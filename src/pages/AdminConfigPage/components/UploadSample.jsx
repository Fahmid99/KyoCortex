import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import Dropzone from "../../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadConfirmCard from "../../../components/UploadConfirmCard";
import configService from "../../../services/configService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import azureDocumentService from "../../../services/azureDocumentService";

function UploadSample({
  setOnUploadSuccess,
  selectedConfig,
  setSelectedConfig,
}) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [keys, setKeys] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [scanType, setScanType] = useState("prebuilt-document");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  const notify = () =>
    toast.success(" Upload Sucessful!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const analyzeDocument = async (base64) => {
    setLoading(true); // Set loading to true
    let obj = {
      base64String: base64,
      scanType: scanType,
    };
    try {
      const response = await azureDocumentService.analyzeDocument(obj);
      updateMapping(response, selectedConfig.id);
      setKeys(response);
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setLoading(false); // Set loading to false
      navigate(`/configuration`, {});
    }
  };

  const updateMapping = async (obj, id) => {
    const azureArray =
      obj.keyValuePairs.length > 0
        ? obj.keyValuePairs
        : obj.documents[0].fields;

    const mapping = azureArray.map((item) => ({
      key: item.key,
      mappedToKey: "",
    }));

    const resultObj = {
      mapping: mapping,
      keyGeneration: true,
      model: scanType,
    };

    try {
      const response = await configService.updateMapping(resultObj, id);
      console.log(response);
    } catch (error) {
      console.error("Error mapping data:", error);
    }
  };

  const handleFileUpload = async () => {
    setOpenDialog(true);
  };

  const handleDialogClose = async (confirm) => {
    setOpenDialog(false);
    if (confirm) {
      const formData = new FormData();
      formData.append("file", file);
      setButtonLoading(true);
      try {
        const response = await configService.convertFileToBase64(formData);
        const base64String = response.base64String;
        await analyzeDocument(base64String);
        notify();
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setButtonLoading(false);
      }
    }
  };

  const handleUploadSuccess = () => {
    setIsUploaded(true);
    notify();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      backgroundColor="#eceff1"
      
    >
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="inherit" />
        </div>
      )}
      <Box width="80%"  paddingBottom="3em" >
      <Typography variant="h5" gutterBottom align="left" sx={{ width: "80%" }}>
        Upload Sample Document
      </Typography>
      <Typography
        fontWeight={"400"}
        marginBottom={"2em"}
        gutterBottom
        align="left"
        sx={{ width: "80%" }}
      >
        Upload a sample document to generate initial keys for this layout.
      </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        maxWidth="800px"
        paddingBottom="8em"
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
      <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Select Scan Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the scan type for the document.
          </DialogContentText>
          <Select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            fullWidth
          >
            <MenuItem value="prebuilt-document">Prebuilt Document</MenuItem>
            <MenuItem value="prebuilt-invoice">Prebuilt Invoice</MenuItem>
            <MenuItem value="prebuilt-receipt">Prebuilt Receipt</MenuItem>
            <MenuItem value="prebuilt-businessCard">
              Prebuilt Business Card
            </MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
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
    </Box>
  );
}

export default UploadSample;
