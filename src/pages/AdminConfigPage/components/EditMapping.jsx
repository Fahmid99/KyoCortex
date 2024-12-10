import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import configService from "../../../services/configService";
import { useNavigate } from "react-router-dom";
import stringSimilarity from "string-similarity";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import KeyIcon from "@mui/icons-material/Key";
import ClearIcon from "@mui/icons-material/Clear";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WarningMessage from "./WarningMessage";

function EditMapping({ selectedConfig, setSelectedConfig }) {
  const [formFields, setFormFields] = useState([]);
  const [mappingData, setMappingData] = useState(selectedConfig.mapping);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [autoMappedCount, setAutoMappedCount] = useState(0);
  const [hasDuplicates, setHasDuplicates] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");
  const navigate = useNavigate();
  const notify = () =>
    toast.success("Changes have been saved!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      color: "blue",
    });

  useEffect(() => {
    const getFormFields = async () => {
      try {
        const response = await configService.getFormFields(
          selectedConfig.technicalName
        );
        console.log("Form fields:", response);
        setFormFields(response);
      } catch (error) {
        console.error("Error fetching form fields:", error);
      } finally {
        setLoading(false);
      }
    };
    getFormFields();
  }, [selectedConfig]);

  useEffect(() => {
    checkForDuplicates();
  }, [mappingData]);

  const checkForDuplicates = () => {
    const mappedToKeys = mappingData
      .map((item) => item.mappedToKey)
      .filter(Boolean);
    const uniqueKeys = new Set(mappedToKeys);
    if (mappedToKeys.length !== uniqueKeys.size) {
      setDuplicateError(
        "Duplicate form fields selected. Please ensure each field is unique."
      );
    } else {
      setDuplicateError("");
    }
  };

  const handleMappingChange = (index, event) => {
    const newMappingData = [...mappingData];
    newMappingData[index].mappedToKey = event.target.value;
    setMappingData(newMappingData);
    setIsChanged(true);
  };

  const handleSubmit = async () => {
    if (duplicateError) {
      setError("Please resolve duplicate form fields before saving.");
      return;
    }

    const mappedToKeys = mappingData.map((mapping) => mapping.mappedToKey);
    setError("");
    const mapping = mappingData.map((item) => ({
      key: item.key,
      mappedToKey: item.mappedToKey,
    }));

    const obj = {
      mapping: mapping,
    };

    try {
      const response = await configService.updateMapping(
        obj,
        selectedConfig.id
      );
      console.log("Mapping array:", mapping);
      console.log("Update response:", response);
    } catch (error) {
      console.error("Error updating mapping:", error);
      setError("Failed to update mapping. Please try again.");
    } finally {
      notify();
      //navigate(`/configuration`);
    }
  };

  const handleAutoMatch = () => {
    let count = 0;
    const newMappingData = mappingData.map((item) => {
      const bestMatch = stringSimilarity.findBestMatch(
        item.key,
        formFields
      ).bestMatch;
      if (bestMatch.rating > 0.5) {
        // Adjust the threshold as needed
        count++;
        console.log(`Auto-mapping ${item.key} to ${bestMatch.target}`);
        return { ...item, mappedToKey: bestMatch.target };
      }
      return item;
    });
    setMappingData(newMappingData);
    setAutoMappedCount(count);
    setIsChanged(true);
  };

  const handleClearAll = () => {
    const clearedMappingData = mappingData.map((item) => ({
      ...item,
      mappedToKey: "",
    }));
    setMappingData(clearedMappingData);
    setAutoMappedCount(0);
    setIsChanged(true);
  };

  const handleRegenerateKeys = () => {
    navigate(`/generateInitialKeys/${selectedConfig.id}`);
  };

  const isDuplicate = (key) => {
    const mappedToKeys = mappingData
      .map((item) => item.mappedToKey)
      .filter(Boolean);
    const duplicates = mappedToKeys.filter(
      (item, index) => mappedToKeys.indexOf(item) !== index
    );
    return duplicates.includes(key);
  };

  console.log(selectedConfig);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginTop="5em"
        height="calc(100vh - 100px)"
    
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              display="flex"
              width="90%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box width="50%">
                <Typography
                  variant="h5"
                  gutterBottom
                  align="left"
                  sx={{ width: "80%" }}
                >
                  Edit Mapping - {selectedConfig.technicalName}
                </Typography>
                <Typography
                  fontWeight={"400"}
                  marginBottom={"2em"}
                  gutterBottom
                  align="left"
                  sx={{ width: "80%" }}
                >
                  Edit the key to field mapping using your existing KCP fields
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!isChanged}
                  sx={{
                    marginRight: "1em",
                    borderWidth: 2,
                    fontWeight: "800",
                    fontSize: { xs: "0.75em", sm: "12px" },
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleAutoMatch}
                  sx={{
                    marginRight: "1em",
                    borderWidth: 2,
                    borderColor: "#0a9bcd",
                    color: "#0a9bcd",
                    fontWeight: "800",
                    fontSize: { xs: "0.75em", sm: "12px" },
                    "&:hover": {
                      backgroundColor: "rgba(21, 101, 192, 0.1)",
                      borderColor: "#0a9bcd",
                    },
                  }}
                >
                  <AutoAwesomeMotionIcon sx={{ marginRight: "0.3em" }} />
                  Auto Map
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleRegenerateKeys}
                  sx={{
                    marginRight: "1em",
                    borderWidth: 2,
                    borderColor: "black",
                    fontWeight: "800",
                    fontSize: { xs: "0.75em", sm: "12px" },
                  }}
                >
                  <KeyIcon sx={{ marginRight: "0.3em" }} />
                  Regenerate Keys
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    marginRight: "1em",
                    borderWidth: 2,
                    borderColor: "red",
                    fontWeight: "800",
                    fontSize: { xs: "0.75em", sm: "12px" },
                  }}
                  onClick={handleClearAll}
                >
                  <ClearIcon sx={{ marginRight: "0.3em" }} />
                  Clear All Fields
                </Button>
              </Box>
            </Box>

            {hasDuplicates && (
              <Box width="90%" sx={{ marginTop: "1em" }}>
                <Alert severity="warning" color="warning">
                  The sample document contains duplicate keys. Please review
                  carefully.
                </Alert>
              </Box>
            )}
            {duplicateError && (
              <Box width="90%" sx={{ marginBottom: "1em" }}>
                <Alert severity="error" color="error">
                  {duplicateError}
                </Alert>
              </Box>
            )}
            <TableContainer
              component={Paper}
              sx={{ width: "90%", height: "70%" }}
            >
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: "#f9f9f9",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>Map to</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappingData.map((mapping, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: isDuplicate(mapping.mappedToKey)
                          ? "rgba(255, 0, 0, 0.1)"
                          : "transparent",
                      }}
                    >
                      <TableCell>{mapping.key}</TableCell>
                      <TableCell>
                        <Select
                      
                          size="small"
                          value={mapping.mappedToKey || ""}
                          onChange={(event) =>
                            handleMappingChange(index, event)
                          }
                          displayEmpty
                          sx={{width:"200px"}}
                        >
                          <MenuItem value="">None</MenuItem>
                          {formFields.map((field, idx) => (
                            <MenuItem key={idx} value={field}>
                              {field}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {error && <Typography color="error">{error}</Typography>}
            <Typography
              color="#0a9bcd"
              sx={{ marginTop: "1em", paddingBottom: "1em" }}
            >
              {autoMappedCount} keys have been automatically mapped.
            </Typography>
          </>
        )}
      </Box>
    </>
  );
}

export default EditMapping;
