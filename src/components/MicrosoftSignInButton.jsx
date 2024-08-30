import { Button } from "@mui/material";
import MicrosoftIcon from "../assets/microsoftsvg.svg";

export default function MicrosoftSignInButton() {
  return (
    <Button
      variant="outlined"
      startIcon={
        <img
          src={MicrosoftIcon}
          alt="Microsoft"
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
      Sign In with Microsoft
    </Button>
  );
}
