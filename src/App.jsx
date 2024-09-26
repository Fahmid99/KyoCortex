import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import Cookies from "js-cookie";
import AdminConfigPage from "./pages/AdminConfigPage/AdminConfigPage";
import EditMapping from "./pages/AdminConfigPage/components/EditMapping";
import UploadSample from "./pages/AdminConfigPage/components/UploadSample";
import configService from "./services/configService";
function App() {
  const scanTypeValues = {
    default: "prebuilt-document",
    invoicetemplate: "prebuilt-invoice",
    receipttemplate: "prebuilt-receipt",
    contracttemplate: "prebuilt-contract",
  };

  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   localStorage.getItem("isLoggedIn") === "true"
  // );

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
  const [configData, setConfigData] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState();
  const [docType, setDocType] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Cookies.get("isLoggedIn") === "true"
  );

  useEffect(() => {
    Cookies.set("isLoggedIn", isLoggedIn);
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
        {/* {isLoggedIn && (
          <Navbar setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} />
        )} */}
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
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LoginPage
                    setIsLoggedIn={setIsLoggedIn}
                    setIsAdmin={setIsAdmin}
                  />
                )
              }
            />
            <Route
              path="/upload"
              element={
                isLoggedIn ? (
                  <UploadPage setOnUploadSuccess={setOnUploadSuccess} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/upload-test"
              element={
                isLoggedIn ? (
                  <UploadPageTest setOnUploadSuccess={setOnUploadSuccess} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboardtest"
              element={
                isLoggedIn ? (
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
                    setDocType={setDocType}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/frame"
              element={isLoggedIn ? <Frame /> : <Navigate to="/" />}
            />
            <Route
              path="/document-history"
              element={
                isLoggedIn ? (
                  <DocumentsPage
                    setCurrentDocument={setCurrentDocument}
                    analyzeDocument={analyzeDocument}
                    getDocumentBase64={getDocumentBase64}
                    setScanType={setScanType}
                    scanType={scanType}
                    selectedDocument={selectedDocument}
                    setSelectedDocument={setSelectedDocument}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/selectskill/:id"
              element={
                isLoggedIn ? (
                  <AbbySelectSkillPage currentDocument={currentDocument} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/docintel/:id"
              element={
                isLoggedIn ? (
                  <DocIntelPage
                    base64={base64}
                    documentData={documentData}
                    scanType={scanType}
                    selectedDocument={selectedDocument}
                    docId={docId}
                    docFormFields={docFormFields}
                    processId={processId}
                    docType={docType}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/abbysignin"
              element={isLoggedIn ? <AbbySignInPage /> : <Navigate to="/" />}
            />
            <Route
              path="/configuration"
              element={
                isLoggedIn ? (
                  <AdminConfigPage
                    configData={configData}
                    setConfigData={setConfigData}
                    setSelectedConfig={setSelectedConfig}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/editMapping/:id"
              element={
                isLoggedIn ? (
                  <EditMapping selectedConfig={selectedConfig} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/generateInitialKeys/:id"
              element={
                isLoggedIn ? (
                  <UploadSample selectedConfig={selectedConfig} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
