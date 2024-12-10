import { Button } from "@mui/material";
import DCPLogo from "../assets/DCPLogo.png";

export default function MicrosoftSignInButton({handleDCPLogin}) {
  return (
    <Button
      variant="outlined"
      onClick={handleDCPLogin}
      startIcon={
        <img
          src={DCPLogo}
          alt="DCP"
          style={{ width: 20, height: 20 }}
        />
      }
      sx={{
        textTransform: "none",
        borderColor: "#eeeeee",
        color: "#0078D4",
        marginBottom: "1em",
        width: "100%",
      }}
    >
      Sign In with DCP
    </Button>
  );
}
