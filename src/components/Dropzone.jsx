import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import BlueOpen from "../assets/blueopen.svg";
import BlueClose from "../assets/blueclose.svg";
import BlueContain from "../assets/bluecontain.svg";
import {
  Card,
  Checkbox,
  FormControl,
  Link,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function Dropzone(props) {
  const [icon, setIcon] = useState(BlueClose);
  const { getRootProps, getInputProps, open, acceptedFiles, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: () => setIcon(BlueContain),
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f9f9f9",
      }}
    >
      <div
        {...getRootProps()}
        style={{
          width: "80%",
          maxWidth: "600px",
          padding: "20px",
          border: "2px dashed #BEC8D4",
          borderRadius: "10px",
          background: isDragActive ? "#E3F2FD" : "#F2F6FC",
          textAlign: "center",
          cursor: "pointer",
          transition: "background-color 0.3s, transform 0.3s",
          transform: isDragActive ? "scale(1.05)" : "scale(1)",
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
        <p style={{ margin: "20px 0", fontSize: "16px", color: "#424242" }}>
          Drag your documents, photos, or videos here to start uploading.
        </p>
        <p style={{ margin: "20px 0", fontSize: "16px", color: "#424242" }}>
          OR
        </p>
        <Button
          type="button"
          onClick={open}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#4354F8",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Browse files
        </Button>
      </div>
      <aside style={{ marginTop: "20px", width: "80%", maxWidth: "600px" }}>
        <h4
          style={{ marginBottom: "10px", fontSize: "18px", color: "#424242" }}
        >
          Files
        </h4>
        <ul style={{ listStyle: "none", padding: "0" }}>{files}</ul>
      </aside>
    </div>
  );
}
