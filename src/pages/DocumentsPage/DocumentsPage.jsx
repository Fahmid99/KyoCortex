import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
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
    backgroundColor: theme.palette.action.hover, // Change this to your desired hover color
  },
  cursor: "pointer",
}));

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await documentService.getDocuments();
      if (data) {
        setDocuments(data);
      } else {
        console.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (document) => {
    setSelectedDocument(document);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDocument(null);
  };

  const handleEngineChange = (event) => {
    setSelectedEngine(event.target.value);
  };

  const handleConfirm = () => {
    navigate("/selectskill");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <StyledTableRow
                key={document.id}
                onClick={() => handleRowClick(document)}
              >
                <TableCell>{document.id}</TableCell>
                <TableCell>{document.name}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>

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

export default DocumentsPage;
