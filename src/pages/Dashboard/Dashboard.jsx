import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const handleUploadClick = () => {
    navigate("/upload");
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
      </div>
      <Button sx={{ fontSize: "16px" }} onClick={handleUploadClick}>
        Go to upload
      </Button>
    </div>
  );
}

export default Dashboard;
