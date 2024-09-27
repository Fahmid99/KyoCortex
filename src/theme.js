import { createTheme } from "@mui/material/styles";

export const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#3b6df1",
    },
    secondary: {
      main: "#000004",
    },
  },
  typography: {
    fontFamily: "Manrope, Arial, sans-serif", // Set Manrope as the default font
    h5: {
      fontWeight: 700,
      marginBottom: "0.5em",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        //size: "small", // Set default size to small
      },
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small", // Set default size to small
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: "bold", // Set font weight to bold
          textTransform: "capitalize",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "rgba(30, 31, 43, 0.16) 0px 4px 8px",
        },
      },
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
  },
};

const theme = createTheme(themeOptions);

export default theme;
