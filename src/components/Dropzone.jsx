import { useState } from "react";
import { useDropzone } from "react-dropzone";
import BlueOpen from "../assets/blueopen.svg";
import BlueClose from "../assets/blueclose.svg";
import BlueContain from "../assets/bluecontain.svg";
import { Button, Divider } from "@mui/material";

export default function Dropzone({ onUploadSuccess }) {
  const [icon, setIcon] = useState(BlueClose);
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: () => {
      setIcon(BlueContain);
      onUploadSuccess(); // Notify parent component of successful upload
    },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "white",
        padding: "30px",
        borderRadius: "30px",
        textAlign: "center",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.3s",
        transform: isDragActive ? "scale(1.05)" : "scale(1)",
        border: "1px solid #e0e0e0",
      }}
    >
      <div
        {...getRootProps()}
        style={{
          width: "400px",
          minWidth: "100px",
          padding: "20px",
          border: "2px dashed #BEC8D4",
          borderRadius: "30px",
          background: isDragActive ? "#E3F2FD" : "#F2F6FC",
          margin: "auto",
        }}
      >
        <input {...getInputProps()} />
        <img
          src={isDragActive ? BlueOpen : icon}
          alt="Folder Icon"
          style={{
            width: "50px",
            height: "50px",
            transition: "transform 0.5s ease, opacity 0.5s ease",
            transform: isDragActive ? "rotate(3deg)" : "rotate(0deg)",
            opacity: isDragActive ? 0.8 : 1,
          }}
        />
        <p style={{ fontSize: "16px", color: "#424242", fontWeight: "500" }}>
          Drag your documents, or
        </p>
        <p style={{ fontSize: "16px", color: "#424242", fontWeight: "500" }}>
          files here to start analyzing.
        </p>
        <p style={{ margin: "20px 0", fontSize: "16px", color: "#424242" }}>
          <Divider sx={{ width: "40%", margin: "auto", textAlign: "center" }}>
            OR
          </Divider>
        </p>
        <Button
          type="button"
          onClick={open}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#1976D2",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Browse files
        </Button>
      </div>
    </div>
  );
}
