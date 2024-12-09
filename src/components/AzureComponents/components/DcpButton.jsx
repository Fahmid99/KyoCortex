import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import DCPIcon from "../../../assets/DCPLogo.png";

export default function DCPSignInButton({setIsLoggedIn}) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    setIsLoggedIn(true)
    navigate('/dashboard'); // Redirect to the dashboard
  };

  return (
    <Button
      variant="outlined"
      startIcon={
        <img
          src={DCPIcon}
          alt="Microsoft"
          style={{ width: 25, height: 20 }}
        />
      }
      sx={{
        textTransform: "none",
        borderColor: "#eeeeee",
        color: "#0078D4",
        marginBottom: "1em",
        width: "100%",
      }}
      onClick={handleSignIn}
    >
      Sign In with Digital Cloud Platform
    </Button>
  );
}