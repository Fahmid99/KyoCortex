import React, { useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(110%);
  }
`;

const AnimatedAlert = styled(Alert)`
  position: fixed;
  top: 10px;
  right: 10px;
  animation: ${(props) => (props.show ? slideIn : slideOut)} 0.5s forwards;
`;

function AlertMessage({ onUploadSuccess, setOnUploadSuccess }) {
  useEffect(() => {
    if (onUploadSuccess) {
      const timer = setTimeout(() => {
        setOnUploadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onUploadSuccess, setOnUploadSuccess]);

  return (
    <div>
      <AnimatedAlert severity="success" show={onUploadSuccess}>
        <AlertTitle>Success</AlertTitle>
        Upload was successful
      </AnimatedAlert>
    </div>
  );
}

export default AlertMessage;
