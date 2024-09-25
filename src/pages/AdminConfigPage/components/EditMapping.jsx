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
} from "@mui/material";
import configService from "../../../services/configService";

function EditMapping({ selectedConfig }) {
  const [formFields, setFormFields] = useState([]);
  const [mappingData, setMappingData] = useState(selectedConfig.mapping);
  const [error, setError] = useState("");

  useEffect(() => {
    const getFormFields = async () => {
      const response = await configService.getFormFields(
        selectedConfig.technicalName
      );
      setFormFields(response);
    };
    getFormFields();
  }, [selectedConfig]);

  const handleMappingChange = (index, event) => {
    const newMappingData = [...mappingData];
    newMappingData[index].mappedToKey = event.target.value;
    setMappingData(newMappingData);
  };

  const handleSubmit = async () => {
    const mappedToKeys = mappingData.map((mapping) => mapping.mappedToKey);
    const hasDuplicates = new Set(mappedToKeys).size !== mappedToKeys.length;
  
    if (hasDuplicates) {
      setError("Duplicate mappedToKey values are not allowed.");
    } else {
      setError("");
      const mapping = mappingData.map((item) => ({
        key: item.key,
        mappedToKey: item.mappedToKey
      }));
      try {
        const response = await configService.updateMapping(mapping, selectedConfig.id);
        console.log("Mapping array:", mapping);
        console.log("Update response:", response);
        // You can now use the mapping array as needed
      } catch (error) {
        console.error("Error updating mapping:", error);
        setError("Failed to update mapping. Please try again.");
      }
    }
  };
  
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Map to</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappingData.map((mapping, index) => (
              <TableRow key={index}>
                <TableCell>{mapping.key}</TableCell>
                <TableCell>
                  <Select
                    value={mapping.mappedToKey || ""}
                    onChange={(event) => handleMappingChange(index, event)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select a field
                    </MenuItem>
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
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
}

export default EditMapping;
