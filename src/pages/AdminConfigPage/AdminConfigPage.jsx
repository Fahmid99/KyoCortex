import React, { useEffect, useState } from "react";
import keimService from "../../services/keimService";
import configService from "../../services/configService";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

function AdminConfigPage({ configData, setConfigData, setSelectedConfig }) {
  const scanTypeValues = {
    default: "prebuilt-document",
    invoicetemplate: "prebuilt-invoice",
    receipttemplate: "prebuilt-receipt",
    contracttemplate: "prebuilt-contract",
  };
  const navigate = useNavigate();

  useEffect(() => {
    const getConfig = async () => {
      try {
        const response = await configService.getConfig();
        console.log(response);
        setConfigData(response);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    getConfig();
  }, []);

  const handleEdit = (id, status, type) => {
    console.log(event.target.value)
    setSelectedConfig(type);
    if (status) {
      navigate(`/editMapping/${id}`);
    } else {
      navigate(`/generateInitialKeys/${id}`);
    }
  };

  console.log(configData);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configData.map((type) => (
              <TableRow key={type.technicalName}>
                <TableCell>{type.label}</TableCell>
                <TableCell>{type.model}</TableCell>
                <TableCell>
                  {type.keyGeneration
                    ? "Ready for Use"
                    : "Configuration Required"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handleEdit(type.id, type.keyGeneration, type)
                    }
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AdminConfigPage;
