import { useEffect } from "react";
import { TextField, Button, Grid, Typography, Divider } from "@mui/material";
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
}) => {
  useEffect(() => {
    if (documentData) {
      const initialautoFormValues = {};
      console.log(scanType)
      if (scanType !== "prebuilt-document") {
        documentData.documents[0].fields.forEach((field) => {
          initialautoFormValues[field.key] = {
            value: field.value || "",
            confidence: field.confidence || 0, // Assuming confidence is a property of field
            color: field.color,
          };
        });
      } else {
        documentData.keyValuePairs.forEach((pair) => {
          initialautoFormValues[pair.key] = {
            value: pair.value || "",
            confidence: pair.confidence || 0, // Assuming confidence is a property of pair
            color: pair.color,
          };
        });
      }

      setAutoFormValues(initialautoFormValues);
    }
  }, [documentData, scanType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", autoFormValues);
  };

  const handleClick = (name) => {
    setSelectedKey(name);
    console.log("Selected key:", name);
    console.log(autoFormValues);
  };

  return (
    <div
      style={{
        border: "1px solid #E7E7E8",
        borderTop: "none",
        height: "auto", // Set height to fit the screen
        paddingBottom: "20px",
        background: "white",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container>
        
          {Object.entries(autoFormValues).map(
            ([key, { value, confidence, color }]) => (
              <Grid item xs={12} key={key} sx={{ marginTop: "0.5em"  }}>
                <Grid container alignItems="center">
                  <Grid item>
                    <div
                      style={{
                        backgroundColor: color,
                        width: "20px",
                        height: "20px",
                        margin: "5px",
                        marginLeft: "10px",
                      }}
                    ></div>
                  </Grid>
                  <Grid item>
                    <Typography
                      style={{ marginLeft: "10px", fontWeight: "bold" }}
                    >
                      {key}
                    </Typography>
                  </Grid>
                </Grid>

                {key.includes("date") ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={key}
                      value={value || null} // Ensure value is not undefined
                      onChange={(date) => handleDateChange(key, date)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                ) : (
                  <>
                    <div
                      style={{
                        margin: "5px",
                        padding: "0.5em",
                      }}
                    >
                      <TextField
                        name={key}
                        value={value || ""} // Ensure value is not undefined
                        onChange={handleChange}
                        fullWidth
                        onClick={() => handleClick(key)}
                        sx={{ background: "white" }}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            fontWeight: "bold",
                            color: "black",
                          },
                        }}
                      />
                      <ConfidenceDisplay confidence={confidence} />
                    </div>
                    <Divider style={{ margin: "10px 0", width: "100%" }} />
                  </>
                )}
              </Grid>
            )
          )}

          <Grid item xs={12} container justifyContent="center">
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AutomatedForm;
