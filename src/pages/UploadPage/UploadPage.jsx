import React, { useState } from "react";
import { Select, MenuItem, Button, Typography } from "@mui/material";
import Dropzone from "../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadConfirmCard from "../../components/UploadConfirmCard";
import documentService from "../../services/documentService";
function UploadPage() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);
    console.log(formData);
    setButtonLoading(true);
    documentService.uploadDocument(formData);

    setButtonLoading(false);
  };

  const handleUploadSuccess = () => {
    setIsUploaded(true);
  };

  const handleSkillChange = (event) => {
    setSelectedSkill(event.target.value);
    setShowReviewButton(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: `calc(100vh - 80px)`,
        background: "#eceff1",
      }}
    >
      <Dropzone
        onUploadSuccess={handleUploadSuccess}
        setFileName={setFileName}
        setFile={setFile}
      />
      <UploadConfirmCard
        isUploaded={isUploaded}
        selectedSkill={selectedSkill}
        handleSkillChange={handleSkillChange}
        fileName={fileName}
        handleFileUpload={handleFileUpload}
        setButtonLoading={setButtonLoading}
        buttonLoading={buttonLoading}
      />
    </div>
  );
}

export default UploadPage;
