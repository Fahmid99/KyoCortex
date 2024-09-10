import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#FAFAFA",
  color: theme.palette.common.black,
  fontWeight: "normal",
  position: "sticky",
  top: 0,
  zIndex: 1,
  borderTop: "1px solid #E0E0E0",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.action.white,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  cursor: "pointer",
}));

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);
};

const scanTypeValues = {
  Default: "prebuilt-document",
  Invoice: "prebuilt-invoice",
  Receipt: "prebuilt-receipt",
  Contract: "prebuilt-contract",
  Id: "prebuilt-idDocument",
};

function DocumentsTable({
  documents,
  selectedDocument,
  selectedEngine,
  handleRowClick,
  handleClose,
  handleEngineChange,
  handleConfirm,
  open,
  setScanType,
  scanType
}) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedDocuments = documents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          margin: "2em",
          paddingTop: "2em",
          width: "80%",
          boxShadow: "none",
          border: "1px solid #E0E0E0",
          borderBottom: "none",
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1em 0 1em",
          }}
        >
          <Typography variant="h6" sx={{ margin: "1em" }} gutterBottom>
            Documents
          </Typography>
          <Box>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <IconButton>
              <FilterListIcon />
            </IconButton>
            <IconButton>
              <SortIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        <Table>
          <TableHead sx={{ background: "#FAFAFA" }}>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Upload Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.map((document) => (
              <StyledTableRow
                key={document.id}
                onClick={() => handleRowClick(document)}
              >
                <TableCell>{document.id}</TableCell>
                <TableCell>
                  {document.contents ? document.contents[0].path : "unknown"}
                </TableCell>
                <TableCell>{formatDate(document.created)}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={documents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Document Analyze</DialogTitle>
          <DialogContent>
            {selectedDocument && (
              <>
                <FormControl fullWidth sx={{ marginTop: 1 }}>
                  <InputLabel id="select-engine-label">
                    Select Engine
                  </InputLabel>
                  <Select
                    labelId="select-engine-label"
                    value={selectedEngine}
                    onChange={handleEngineChange}
                    label="Select Engine"
                  >
                    <MenuItem value="ABBY">ABBY</MenuItem>
                    <MenuItem value="Azure Document Intelligence">
                      Azure Document Intelligence
                    </MenuItem>
                  </Select>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="scan-type-label">Scan Type</InputLabel>
                    <Select
                      labelId="scan-type-label"
                      value={scanType}
                      label="Scan Type"
                      onChange={(e) => {
                        setScanType(e.target.value);
                        console.log(e.target.value);
                      }}
                    >
                      {Object.keys(scanTypeValues).map((key) => (
                        <MenuItem key={key} value={scanTypeValues[key]}>
                          {key}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </div>
  );
}

export default DocumentsTable;
