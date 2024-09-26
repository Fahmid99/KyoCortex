import React, { useState } from "react";
import { Select, MenuItem, Button, Typography, Box } from "@mui/material";
import Dropzone from "../../../components/Dropzone";
import InfoIcon from "@mui/icons-material/Info"; // Importing an icon
import UploadConfirmCard from "../../../components/UploadConfirmCard";
import configService from "../../../services/configService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import azureDocumentService from "../../../services/azureDocumentService";

function UploadSample({ setOnUploadSuccess, selectedConfig }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [keys, setKeys] = useState();
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
    // setLoading(true);
    let obj = {
      base64String: base64,
      scanType: "prebuilt-document",
    };
    try {
      const response = await azureDocumentService.analyzeDocument(obj);
      // const response = await azureDocumentService.analyzeDocument();
      updateMapping(response, selectedConfig.id);
      setKeys(response);
    } catch (error) {
      console.error("Error analyzing document:", error);
    }
  };

  const updateMapping = async (obj, id) => {
    const mapping = obj.keyValuePairs.map((item) => ({
      key: item.key,
      mappedToKey: "",
    }));
    try {
      const response = await configService.updateMapping(mapping, id);
      console.log(response);
    } catch (error) {
      console.error("Error mapping data:", error);
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);
    console.log(formData);
    setButtonLoading(true);
    try {
      const response = await configService.convertFileToBase64(formData); // Pass formData instead of file
      console.log(response);
      const base64String = response.base64String; // Extract the base64 string from the response

      await analyzeDocument(base64String); // Pass the base64 string to analyzeDocument
      // Call notify here
      // navigate("/document-history");
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
      />{" "}
      {/* Add this line */}
    </div>
  );
}

export default UploadSample;
