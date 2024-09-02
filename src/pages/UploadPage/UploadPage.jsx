import React, { useState } from "react";
import { Select, MenuItem, Button, Typography } from "@mui/material";
import Dropzone from "../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadConfirmCard from "../../components/UploadConfirmCard";

function UploadPage() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
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
      />
      <UploadConfirmCard
        isUploaded={isUploaded}
        selectedSkill={selectedSkill}
        handleSkillChange={handleSkillChange}
        fileName={fileName}
      />
    </div>
  );
}

export default UploadPage;
