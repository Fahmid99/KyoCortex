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
import theme from "./theme"; // Import the custom theme
import DocumentsPage from "./pages/DocumentsPage/DocumentsPage";
import AlertMessage from "./components/AlertMessage"; // Correct import
import DocIntelPage from "./pages/DocIntelPage/DocIntelPage";
import azureDocumentService from "./services/azureDocumentService";
import Loader from "./components/AzureComponents/components/Loader";
import UploadPageTest from "./pages/UploadPageTest/UploadPageTest";
import Cookies from "js-cookie";
import AdminConfigPage from "./pages/AdminConfigPage/AdminConfigPage";
import EditMapping from "./pages/AdminConfigPage/components/EditMapping";
import UploadSample from "./pages/AdminConfigPage/components/UploadSample";
import CallbackHandler from "./components/CallbackHandler";
import PrivateRoute from "./components/PrivateRoute";
import dcpService from "./services/dcpService";
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
  const [documentClasses, setDocumentClasses] = useState([]);
  const [folders, setFolders] = useState([]);
  const [file, setFile] = useState();
  const [folderId, setFolderId] = useState("");
  const [documentClassId, setDocumentClassId] = useState("");
  const [dcpFields, setDcpFields] = useState("");
 
  useEffect(() => {
    const getDocumentClasses = async () => {
      try {
        const response = await dcpService.getDocumentClasses();

        console.log(response);
        setDocumentClasses(response.documentClasses);
      } catch (error) {
        console.error("Error fetching file types:", error);
      }
    };

    console.log(documentClasses);

    const getFolders = async () => {
      try {
        const response = await dcpService.getFolders();
        console.log(response);
        setFolders(response.objects);
      } catch (error) {
        console.error("Error fetching file types:", error);
      }
    };

    getDocumentClasses();
    getFolders();
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
  console.log(documentClasses);
  console.log(isAdmin);
  console.log(folders);
  console.log(dcpFields);
  console.log(docFormFields);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isLoggedIn &&
          !location.pathname.startsWith("/docintel") &&
          !location.pathname.startsWith("/dashboardtest") && (
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
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/callback"
              element={<CallbackHandler setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                isLoggedIn ? (
                  <UploadPage
                    setOnUploadSuccess={setOnUploadSuccess}
                    documentClasses={documentClasses}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/upload-test"
              element={
                isLoggedIn ? (
                  <UploadPageTest
                    setOnUploadSuccess={setOnUploadSuccess}
                    documentClasses={documentClasses}
                    folders={folders}
                    file={file}
                    setFile={setFile}
                    base64={base64}
                    analyzeDocument={analyzeDocument}
                    setScanType={setScanType}
                    scanTypeValues={scanTypeValues}
                    folderId={folderId}
                    setFolderId={setFolderId}
                    documentClassId={documentClassId}
                    setDocumentClassId={setDocumentClassId}
                    setDcpFields={setDcpFields}
                    documentData={documentData}
                  />
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
              }
            />

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
                  docType={docType}
                  file={file}
                  documentClassId={documentClassId}
                  folderId={folderId}
                  dcpFields={dcpFields}
                  setDcpFields={setDcpFields}
                />
              }
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
                  <EditMapping
                    selectedConfig={selectedConfig}
                    setSelectedConfig={setSelectedConfig}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/generateInitialKeys/:id"
              element={
                isLoggedIn ? (
                  <UploadSample
                    selectedConfig={selectedConfig}
                    setSelectedConfig={setSelectedConfig}
                  />
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
