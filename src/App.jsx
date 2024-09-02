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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
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
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/frame" element={<Frame />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
