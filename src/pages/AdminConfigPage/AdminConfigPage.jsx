import React, { useEffect, useState } from "react";
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
  Typography,
  Divider,
  Box,
  TablePagination,
  TextField,
  TableSortLabel,
  Chip,
} from "@mui/material";

function AdminConfigPage({ configData, setConfigData, setSelectedConfig }) {
  const scanTypeValues = {
    default: "prebuilt-document",
    invoicetemplate: "prebuilt-invoice",
    receipttemplate: "prebuilt-receipt",
    contracttemplate: "prebuilt-contract",
  };
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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
  }, [setConfigData]);

  const handleEdit = (id, status, type) => {
    setSelectedConfig(type);
    if (status) {
      navigate(`/editMapping/${id}`);
    } else {
      navigate(`/generateInitialKeys/${id}`);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredData = configData
    .filter((type) =>
      type.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.keyGeneration === b.keyGeneration
          ? 0
          : a.keyGeneration
          ? -1
          : 1;
      } else {
        return a.keyGeneration === b.keyGeneration
          ? 0
          : a.keyGeneration
          ? 1
          : -1;
      }
    });

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h5" gutterBottom align="left" sx={{ width: "80%" }}>
        Admin Configuration Page
      </Typography>
      <Typography
        fontWeight={"400"}
        marginBottom={"2em"}
        gutterBottom
        align="left"
        sx={{ width: "80%" }}
      >
        Configure all documents and folder types from KEIM
      </Typography>

      <Divider sx={{ width: "80%", marginBottom: 2 }} />
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ marginBottom: 2, width: "80%" }}
      />
      <TableContainer component={Paper} sx={{ width: "80%", height: "auto" }}>
        <Table>
          <TableHead sx={{ background: "#f9f9f9" }}>
            <TableRow>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Model</TableCell>
              <TableCell align="left">
                <TableSortLabel
                  active
                  direction={sortOrder}
                  onClick={handleSort}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((type) => (
                <TableRow key={type.technicalName}>
                  <TableCell align="left">{type.label}</TableCell>
                  <TableCell align="left">{type.model}</TableCell>
                  <TableCell align="left">
                    <Chip
                      label={
                        type.keyGeneration
                          ? "Ready for Use"
                          : "Configuration Required"
                      }
                      sx={{
                        backgroundColor: type.keyGeneration
                          ? "green"
                          : "#ffb74d",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleEdit(type.id, type.keyGeneration, type)
                      }
                    >
                      {type.keyGeneration ? "Edit" : "Configure"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

export default AdminConfigPage;
