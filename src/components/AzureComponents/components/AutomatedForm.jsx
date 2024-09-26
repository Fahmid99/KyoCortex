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
import configService from "../../../services/configService";

const AutomatedForm = ({
  documentData,
  scanType,
  setAutoFormValues,
  autoFormValues,
  setSelectedKey,
  setSelectedValue,
  setSelectedKeyPolygon,
  setSelectedValuePolygon,
  handleSubmit,
  pageNumber,
  setPageNumber,
  docType
}) => {
  const [bgColor, setBgColor] = useState("white");
  const [selectedField, setSelectedField] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [formFields, setFormFields] = useState({});
  const [formFieldsLoaded, setFormFieldsLoaded] = useState(false); // New state variable

  useEffect(() => {
    const getFormFields = async () => {
      const response = await configService.getConfig();
      const selectedConfig = response.filter(
        (config) => config.technicalName === docType
      );

      const filteredFormFields = selectedConfig[0].mapping.filter(
        (obj) => obj.mappedToKey !== ""
      );

      const formFieldsObject = filteredFormFields.reduce((acc, field) => {
        acc[field.key] = {
          name: field.key,
          mappedToKey: field.mappedToKey,
        };
        return acc;
      }, {});

      setFormFields(formFieldsObject);
      setFormFieldsLoaded(true); // Set form fields as loaded
    };
    getFormFields();
  }, []);

  console.log(formFields);

  useEffect(() => {
    if (documentData && formFieldsLoaded) { // Check if form fields are loaded
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
          if (pair.key in formFields) {
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
              pageNumber: pair.pageNumber,
              technicalName: formFields[pair.key].mappedToKey,
            };
          }
        });
      }

      setAutoFormValues(initialautoFormValues);
    }
  }, [documentData, scanType, formFieldsLoaded]); // Add formFieldsLoaded as a dependency

  console.log(autoFormValues);
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

  const handleCardClick = (name, pageNumber) => {
    setPageNumber(pageNumber);
    if (selectedField === name) {
      // Deselect if the same field is clicked again
      setSelectedKey(null);
      setSelectedValue(null);
      setSelectedKeyPolygon(null);
      setSelectedValuePolygon(null);
      setSelectedField(null);
    } else {
      // Select the new field
      setSelectedKey(name);
      setSelectedValue(autoFormValues[name].value);
      setSelectedKeyPolygon(autoFormValues[name].keyPolygon);
      setSelectedValuePolygon(autoFormValues[name].valuePolygon);
      setSelectedField(name);
    }
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
              {
                value,
                confidence,
                color,
                keyPolygon,
                valuePolygon,
                kind,
                pageNumber,
              },
            ]) => (
              <Grid size={12} key={key} sx={{}}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "stretch", // Ensure the card stretches to fit its content
                    boxShadow: "none",
                    cursor: "pointer", // Add cursor pointer for better UX
                    background: selectedField === key ? "#e3f2fd" : "white",
                    border: selectedField === key && "1px solid #2196f3",
                    borderRadius: "0px",
                  }}
                  onClick={() => handleCardClick(key, pageNumber)}
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
                      display={"flex"}
                    >
                      {key}{" "}
                      <Box
                        sx={{
                          background: "#eeeeee",
                          marginLeft: "0.5em",
                          padding: "0.1em",
                          paddingRight: "0.4em",
                          paddingLeft: "0.4em",
                          borderRadius: "4px",
                        }}
                      >
                        # {pageNumber}
                      </Box>
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
                                              value={
                                                cell.content === "<undefined>"
                                                  ? ""
                                                  : cell.content
                                              }
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
                      <TextField
                        name={key}
                        value={value === "<undefined>" ? "" : value} // Ensure value is not undefined
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
