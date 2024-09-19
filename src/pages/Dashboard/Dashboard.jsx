import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
import { useState, useEffect } from "react";
function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userJson = params.get("user");
    if (userJson) {
      try {
        const userObj = JSON.parse(decodeURIComponent(userJson));
        setUser(userObj);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const handleClick = async () => {
    const response = await documentService.getUser();
    console.log(response);
    alert(response.name);
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
        <Typography variant="h2" sx={{ margin: "0.5em" }}>
          Welcome to KyoCortex
        </Typography>
        <Typography variant="h6">Dashboard coming soon...</Typography>
        {user && (
          <div>
             <Typography variant="h8">Welcome, {user.name}!</Typography>
     
            {/* Display other user information as needed */}
          </div>
        )}
      </div>
      <Button sx={{ fontSize: "16px" }} onClick={handleUploadClick}>
        Go to upload
      </Button>
      <Button onClick={handleClick}>Get User</Button>
    </div>
  );
}

export default Dashboard;
