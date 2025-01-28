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
import UploadModal from "./Components/UploadModal";
import dcpService from "../../services/dcpService";

function UploadPage({
  setOnUploadSuccess,
  documentClasses,
  folders,
  file,
  setFile,
  analyzeDocument,
  setScanType,
  scanTypeValues,
  folderId,
  documentClassId,
  setFolderId,
  setDocumentClassId,
  setDcpFields,
}) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [fileName, setFileName] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [select1, setSelect1] = useState("");
  const [select2, setSelect2] = useState("");
  const [textField, setTextField] = useState("");
  const [vendors, setVendors] = useState([]);
  const [parentId, setParentId] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [base64File, setBase64File] = useState(""); // State to store the Base64 string
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  console.log(file);
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

  useEffect(() => {
    if (file) {
      convertToBase64(file);
    }
  }, [file]);

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBase64File(reader.result);
      console.log("Base64 File:", reader.result); // Debugging
    };
    reader.onerror = (error) => {
      console.error("Error converting file to Base64:", error);
    };
  };

  console.log(base64File);
  console.log(fileTypes);
  console.log(selectedFileType);
  setScanType(scanTypeValues["default"]);
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

  const handleClick = async () => {
    try {
      console.log("Analyzing document with Base64:", base64File); // Debugging
      await analyzeDocument(base64File);
      navigate(`/docintel/123`);
    } catch (error) {
      console.error("Error analyzing document:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!isUploaded) return; // Prevent upload if not confirmed
    const formData = new FormData();
    formData.append("file", file);
    const currentDate = new Date().toISOString();
    formData.append("uploadDate", currentDate);
    formData.append("parentId", parentId);
    formData.append("selectedFileType", selectedFileType);
    setButtonLoading(true);
    try {
      await keimService.uploadNewFile(parentId, selectedFileType, formData);
      setOnUploadSuccess(true);
      notify();
      navigate("/document-history");
    } catch (error) {
      console.error("Error uploading file:", error);
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

  const handleModalConfirm = async () => {
    for (let documentClass of documentClasses) {
      if (documentClass.id === documentClassId) {
        const fields = documentClass.fields;
        const dcpFields = {};

        for (let field of fields) {
          dcpFields[field.id] = { value: "", name: field.localName };
        }

        setDcpFields(dcpFields);
        break; // Exit the loop once the matching documentClass is found
      }
    }

  
    if (documentClassId == "tenKdaucustomer1:ldmsksptAyaewklASOT") {
      setLink(
        "/dashboardtest?processId=59501F91D934464FBE1D73C0CA76FD0C&activityId=6BD8443BFF2D4E7186D3C7F42A6F2668"
      );
    } else {
      setLink(
        "/dashboardtest?processId=A50C80E5E76E48D88CA12DAE21CB21E8&activityId=6F8323D1C1C143DFB389076816528A5E"
      );
    }

    navigate(link);
  };

  console.log(documentClassId);
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
      {documentClasses.length > 1 && (
        <UploadModal
          open={openModal}
          onClose={handleModalClose}
          vendors={vendors}
          fileTypes={fileTypes}
          select1={select1}
          setSelect1={setSelect1}
          selectedFileType={selectedFileType}
          setSelectedFileType={setSelectedFileType}
          textField={textField}
          setTextField={setTextField}
          handleModalConfirm={handleModalConfirm}
          documentClasses={documentClasses}
          folders={folders}
          base64File={base64File}
          setFolderId={setFolderId}
          setDocumentClassId={setDocumentClassId}
          folderId={folderId}
          documentClassId={documentClassId}
        />
      )}
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
