import { createTheme } from "@mui/material/styles";
import "@fontsource/inter"; // Import Inter font
import "@fontsource/poppins"; // npm install @fontsource/poppins
const theme = createTheme({
  typography: {
    fontFamily: "Inter, Arial, sans-serif, Poppins",
  },
});

export default theme;
