import { createTheme } from "@mui/material/styles";
import "@fontsource/inter"; // Import Inter font
import "@fontsource/poppins"; // npm install @fontsource/poppins
const theme = createTheme({
  typography: {
    fontFamily: "Inter, Arial, sans-serif, Poppins",
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        borderBottom: "none",
      },
    },
  },
});

export default theme;
