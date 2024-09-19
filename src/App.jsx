import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import LoginPage from "./pages/LoginPage/LoginPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardTest from "./pages/Dashboard/DashBoardTest";
import Navbar from "./components/Navbar";
import "./index.css";
import Frame from "./pages/Frame.jsx/Frame";
import theme from "./theme"; // Import the custom theme
import DocumentsPage from "./pages/DocumentsPage/DocumentsPage";
import AbbySelectSkillPage from "./pages/AbbySelectSkillPage/AbbySelectSkillPage";
import AlertMessage from "./components/AlertMessage"; // Correct import
import DocIntelPage from "./pages/DocIntelPage/DocIntelPage";
import AbbySignInPage from "./pages/AbbySignInPage/AbbySignInPage";
import azureDocumentService from "./services/azureDocumentService";
import Loader from "./components/AzureComponents/components/Loader";
import UploadPageTest from "./pages/UploadPageTest/UploadPageTest";

function App() {
  const scanTypeValues = {
    default: "prebuilt-document",
    invoicetemplate: "prebuilt-invoice",
    receipttemplate: "prebuilt-receipt",
    contracttemplate: "prebuilt-contract",
  };

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [onUploadSuccess, setOnUploadSuccess] = useState(false);
  const [currentDocument, setCurrentDocument] = useState();
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState();
  const [base64, setBase64] = useState();
  const [scanType, setScanType] = useState(scanTypeValues.default);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();
  const [docId, setDocId] = useState();
  const [docFormFields, setDocFormFields] = useState();
  const [processId, setProcessId] = useState(); 


  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const analyzeDocument = async () => {
    setLoading(true);
    let obj = {
      base64String: base64,
      scanType,
    };
    try {
      const response = await azureDocumentService.analyzeDocument(obj);
      // const response = await azureDocumentService.analyzeDocument();
      setDocumentData(response);
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentBase64 = (id) => {
    azureDocumentService.getDocumentBase64(id).then((base64Data) => {
      setBase64(base64Data);
    });
  };

  const getDocumentBase64V2 = (id) => {
    azureDocumentService.getDocumentBase64V2(id).then((base64Data) => {
      setBase64(base64Data);
    });
  };

  console.log(isAdmin);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isLoggedIn && (
          <Navbar setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} /> 
        )}
        {/* <AlertMessage
          onUploadSuccess={onUploadSuccess}
          setOnUploadSuccess={setOnUploadSuccess}
        /> */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Loader />
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <LoginPage
                  setIsLoggedIn={setIsLoggedIn}
                  setIsAdmin={setIsAdmin}
                  sx={{ alignSelf: "center", background: "red" }}
                />
              }
            />
            <Route
              path="/upload"
              element={<UploadPage setOnUploadSuccess={setOnUploadSuccess} />}
            />
            <Route
              path="/upload-test"
              element={
                <UploadPageTest setOnUploadSuccess={setOnUploadSuccess} />
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboardtest"
              element={
                <DashboardTest
                  setCurrentDocument={setCurrentDocument}
                  analyzeDocument={analyzeDocument}
                  getDocumentBase64V2={getDocumentBase64V2}
                  setScanType={setScanType}
                  scanType={scanType}
                  selectedDocument={selectedDocument}
                  setSelectedDocument={setSelectedDocument}
                  scanTypeValues={scanTypeValues}
                  setDocId={setDocId}
                  setDocFormFields={setDocFormFields}
                  setProcessId={setProcessId}
                />
              }
            />
            <Route path="/frame" element={<Frame />} />
            <Route
              path="/document-history"
              element={
                <DocumentsPage
                  setCurrentDocument={setCurrentDocument}
                  analyzeDocument={analyzeDocument}
                  getDocumentBase64={getDocumentBase64}
                  setScanType={setScanType}
                  scanType={scanType}
                  selectedDocument={selectedDocument}
                  setSelectedDocument={setSelectedDocument}
                />
              }
            />
            <Route
              path="/selectskill/:id"
              element={
                <AbbySelectSkillPage currentDocument={currentDocument} />
              }
            />
            <Route
              path="/docintel/:id"
              element={
                <DocIntelPage
                  base64={base64}
                  documentData={documentData}
                  scanType={scanType}
                  selectedDocument={selectedDocument}
                  docId={docId}
                  docFormFields={docFormFields}
                  processId={processId}
                />
              }
            />
            <Route path="/abbysignin" element={<AbbySignInPage />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
