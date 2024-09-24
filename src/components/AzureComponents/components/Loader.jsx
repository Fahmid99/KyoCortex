import { Typography } from "@mui/material";
import HashLoader from "react-spinners/HashLoader";

function Loader() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={"bold"}
          className="breathing-gradient"
          sx={{ padding: "10px", fontFamily: "manrope" , marginBottom:"10px" }}
        >
          Analyzing Document
        </Typography>
        <HashLoader color="#DB0D23" />
      </div>
    </div>
  );
}

export default Loader;
