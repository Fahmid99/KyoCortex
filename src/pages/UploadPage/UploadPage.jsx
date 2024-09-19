import React, { useState } from "react";
import { Select, MenuItem, Button, Typography, Box } from "@mui/material";
import Dropzone from "../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadConfirmCard from "../../components/UploadConfirmCard";
import documentService from "../../services/documentService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function UploadPage({ setOnUploadSuccess }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate = useNavigate();
  const notify = () => toast.success(' Upload Sucessful!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",

    });;

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const currentDate = new Date().toISOString();
    formData.append("uploadDate", currentDate);
    console.log(file);
    console.log(formData);
    setButtonLoading(true);
    try {
      await documentService.uploadDocument(formData);
      setOnUploadSuccess(true);
     // Call notify here
      navigate("/document-history");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setButtonLoading(false);
    }
  };
  
  

  const handleUploadSuccess = () => {
    setIsUploaded(true);
    notify(); 
  
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: `calc(100vh - 80px)`,
        background: "#eceff1",
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

/> {/* Add this line */}
    </div>
  );
}

export default UploadPage;
