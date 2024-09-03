import React, { useState } from "react";
import { Select, MenuItem, Button, Typography, Box } from "@mui/material";
import Dropzone from "../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadConfirmCard from "../../components/UploadConfirmCard";
import documentService from "../../services/documentService";
import { useNavigate } from "react-router-dom";

function UploadPage({ setOnUploadSuccess }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);
    console.log(formData);
    setButtonLoading(true);
    await documentService.uploadDocument(formData);

    setOnUploadSuccess(true);
    setButtonLoading(false);
    navigate("/document-history");
  };

  const handleUploadSuccess = () => {
    setIsUploaded(true);
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
    </div>
  );
}

export default UploadPage;
