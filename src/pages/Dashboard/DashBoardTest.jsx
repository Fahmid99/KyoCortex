import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
import keimService from "../../services/keimService";
import { Button, Typography } from "@mui/material";

function DashboardTest({
  setCurrentDocument,
  analyzeDocument,
  getDocumentBase64V2,
  setScanType,
  scanType,
  selectedDocument,
  setSelectedDocument,
  scan,
  scanTypeValues,
  setDocId,
  setDocFormFields,
  setProcessId,
}) {
  const [documentId, setDocumentId] = useState(null);
  const [base64, setBase64] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const processId = params.get("processId");
        setProcessId(processId);
        const activityId = params.get("activityId");

        if (processId && activityId) {
          const response = await keimService.getDocumentByProcessId(
            processId,
            activityId
          );
          setDocumentId(response.id);
          setDocId(response.id);
          await setDocFormFields(response.formFields);
          console.log(response.formFields);
          if (!response.type.includes("template")) {
            setScanType(scanTypeValues["default"]);
          } else {
            setScanType(scanTypeValues[response.type]);
          }

          const base64Data = await getDocumentBase64V2(response.id);

          setBase64(base64Data);
          await analyzeDocument(base64Data);
          //  navigate(`/docintel/${response.id}`);
        } else {
          console.error("Missing processId or activityId in URL");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    fetchDocument();
  }, []);

  // useEffect(() => {
  //   const analyzeAndNavigate = async () => {
  //     console.log("it work");
  //     if (documentId && base64) {
  //       try {
  //         console.log("Analyzing document...");
  //         await analyzeDocument(base64);
  //         console.log("Document analyzed, navigating...");
  //         navigate(`/docintel/${documentId}`);
  //       } catch (error) {
  //         console.error("Error analyzing document:", error);
  //       }
  //     } else {
  //       console.log("Document ID or base64 not set yet");
  //     }
  //   };
  //   analyzeAndNavigate();
  // }, [documentId, base64, analyzeDocument, navigate]);

  const handleClick = async () => {
    await analyzeDocument(base64);
    navigate(`/docintel/${documentId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Button onClick={handleClick}>Start Analyze</Button>
      </div>
    </div>
  );
}

export default DashboardTest;
