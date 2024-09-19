import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  TextField,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Grid from "@mui/material/Grid2"; // Importing Grid2 and renaming it to Grid
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ConfidenceDisplay from "./ConfidenceDisplay"; // Assuming you have this component

const AutomatedForm = ({
  documentData,
  scanType,
  setAutoFormValues,
  autoFormValues,
  setSelectedKey,
  setSelectedKeyPolygon,
  setSelectedValuePolygon,
  handleSubmit,
  pageNumber
}) => {
  const [bgColor, setBgColor] = useState("white");
  const [selectedField, setSelectedField] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (documentData) {
      const initialautoFormValues = {};
      if (scanType !== "prebuilt-document") {
        documentData.documents[0].fields.forEach((field) => {
          initialautoFormValues[field.key] = {
            value: field.value || "",
            confidence: field.confidence || 0, // Assuming confidence is a property of field
            color: field.color,
            keyPolygon: field.boundingRegions[0]
              ? field.boundingRegions[0].polygon
              : null, // Assuming polygon is a property of field
            kind: field.kind, // Add kind to the initial values
          };
        });
      } else {
        documentData.keyValuePairs.forEach((pair) => {
          initialautoFormValues[pair.key] = {
            value: pair.value || "",
            confidence: pair.confidence || 0, // Assuming confidence is a property of pair
            color: pair.color,
            keyPolygon: pair.keyBoundingRegions[0]
              ? pair.keyBoundingRegions[0].polygon
              : null, // Assuming polygon is a property of pair
            valuePolygon: pair.valueBoundingRegions[0]
              ? pair.valueBoundingRegions[0].polygon
              : null,
            kind: pair.kind, // Add kind to the initial values
          };
        });
      }

      setAutoFormValues(initialautoFormValues);
    }
  }, [documentData, scanType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAutoFormValues((prevValues) => ({
      ...prevValues,
      [name]: {
        ...prevValues[name],
        value: value,
      },
    }));
  };

  const handleDateChange = (name, date) => {
    setAutoFormValues((prevValues) => ({
      ...prevValues,
      [name]: date || null, // Ensure date is not undefined
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formValues = Object.entries(autoFormValues).reduce(
  //     (acc, [key, { value }]) => {
  //       acc[key] = value;
  //       return acc;
  //     },
  //     {}
  //   );
  //   console.log("Form submitted:", formValues);
  // };

  const handleCardClick = (name) => {
    setSelectedKey(name);
    setSelectedKeyPolygon(autoFormValues[name].keyPolygon);
    setSelectedValuePolygon(autoFormValues[name].valuePolygon);
    setSelectedField(name);
    console.log("Selected key:", name);
    console.log("Selected key polygon:", autoFormValues[name].keyPolygon);
    console.log("Selected value polygon:", autoFormValues[name].valuePolygon);
  };

  const handleOpen = (data) => {
    setTableData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTableChange = (rowIndex, key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex].properties[key].content = value;
    setTableData(updatedTableData);
  };

  return (
    <div
      style={{
        border: "1px solid #E7E7E8",
        borderTop: "none",

        background: "white",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={0}>
          {Object.entries(autoFormValues).map(
            ([
              key,
              { value, confidence, color, keyPolygon, valuePolygon, kind },
            ]) => (
              <Grid size={12} key={key} sx={{}}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "stretch", // Ensure the card stretches to fit its content
                    boxShadow: "none",
                    cursor: "pointer", // Add cursor pointer for better UX
                    background: selectedField === key ? "#e3f2fd" : "white",
                    border: selectedField === key && "2px solid #2979ff",
                    borderRadius: "0px",
                  }}
                  onClick={() => handleCardClick(key)}
                >
                  <div
                    style={{
                      background: color,
                      width: "10px", // Increased width for better visibility
                      height: "auto", // Ensure the div stretches to fit the card's height
                    }}
                  ></div>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      style={{ fontWeight: "600", marginBottom: "1em" }}
                    >
                      {key}
                    </Typography>

                    {kind === "array" ? (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpen(value)}
                        >
                          View Table
                        </Button>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          maxWidth="lg"
                          fullWidth
                        >
                          <DialogTitle>{key}</DialogTitle>
                          <DialogContent>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    {Object.keys(value[0].properties).map(
                                      (header) => (
                                        <TableCell key={header}>
                                          {header}
                                        </TableCell>
                                      )
                                    )}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {tableData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                      {Object.entries(row.properties).map(
                                        ([cellKey, cell], cellIndex) => (
                                          <TableCell key={cellIndex}>
                                            <TextField
                                              value={cell.content === "<undefined>" ? "" : cell.content}
                                              onChange={(e) =>
                                                handleTableChange(
                                                  rowIndex,
                                                  cellKey,
                                                  e.target.value
                                                )
                                              }
                                              fullWidth
                                            />
                                          </TableCell>
                                        )
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Close</Button>
                          </DialogActions>
                        </Dialog>
                      </>
                      
                    ) : (
                      //: key.includes("date") ? (
                      //   <LocalizationProvider dateAdapter={AdapterDayjs}>
                      //     <DatePicker
                      //       label={key}
                      //       value={value || null} // Ensure value is not undefined
                      //       onChange={(date) => handleDateChange(key, date)}
                      //       renderInput={(params) => (
                      //         <TextField {...params} fullWidth />
                      //       )}
                      //     />
                      //   </LocalizationProvider>
                      //   )
                      <TextField
                        name={key}
                        value={value ===  "<undefined>" ? "" : value} // Ensure value is not undefined
                        onChange={handleChange}
                        fullWidth
                        sx={{
                          background: "white",
                          marginBottom: "0.5em",
                          borderRadius: "0px",
                        }} // Set borderRadius to 0
                        InputProps={{ sx: { borderRadius: 0 } }}
                      />
                    )}
                    <Box>
                      <ConfidenceDisplay confidence={confidence} />
                    </Box>
                  </CardContent>
                </Card>
                <Divider />
              </Grid>
            )
          )}
        </Grid>
      </form>
    </div>
  );
};

export default AutomatedForm;
