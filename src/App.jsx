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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [onUploadSuccess, setOnUploadSuccess] = useState(false);
  const [currentDocument, setCurrentDocument] = useState();

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
        <AlertMessage
          onUploadSuccess={onUploadSuccess}
          setOnUploadSuccess={setOnUploadSuccess}
        />
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
            element={<DocumentsPage setCurrentDocument={setCurrentDocument} />}
          />
          <Route
            path="/selectskill/:id"
            element={<AbbySelectSkillPage currentDocument={currentDocument} />}
          />
          <Route path="/docintel" element={<DocIntelPage />} />
          <Route path="/abbysignin" element={<AbbySignInPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
