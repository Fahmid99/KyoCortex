import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import LoginPage from "./pages/LoginPage/LoginPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import Dashboard from "./pages/Dashboard/Dashboard";
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
function App() {
  const scanTypeValues = {
    default: "prebuilt-document",
    invoice: "prebuilt-invoice",
    receipt: "prebuilt-receipt",
    contract: "prebuilt-contract",
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

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const analyzeDocument = async () => {
    setLoading(true);
    // let obj = {
    //   base64String: base64,
    //   scanType,
    // };
    try {
      // const response = await azureDocumentService.analyzeDocument(obj);
      const response = await azureDocumentService.analyzeDocument();
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

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
        <AlertMessage
          onUploadSuccess={onUploadSuccess}
          setOnUploadSuccess={setOnUploadSuccess}
        />
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
                  sx={{ alignSelf: "center", background: "red" }}
                />
              }
            />
            <Route
              path="/upload"
              element={<UploadPage setOnUploadSuccess={setOnUploadSuccess} />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
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
                <DocIntelPage base64={base64} documentData={documentData} scanType={scanType} />
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
