import React, { useState } from "react";
import { Select, MenuItem, Button, Typography } from "@mui/material";
import Dropzone from "../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadProcessCard from "../../components/UploadProcessCard";

function UploadPage() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);

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
      <Dropzone onUploadSuccess={handleUploadSuccess} />
      <UploadProcessCard
        isUploaded={isUploaded}
        selectedSkill={selectedSkill}
        handleSkillChange={handleSkillChange}
      />
    </div>
  );
}

export default UploadPage;
