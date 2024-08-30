import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage sx={{ alignSelf: "center", background: "red" }} />
          }
        />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
