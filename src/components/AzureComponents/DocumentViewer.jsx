import { useState, useRef, useEffect } from "react";
import { Grid, Typography, Divider, Tabs, Tab, Box } from "@mui/material";

import AutomatedForm from "./components/AutomatedForm";
import PdfViewer from "./components/PdfViewer";
import Toolbar from "./components/Toolbar";
import ActionTab from "./components/ActionTab";
import JsonDisplay from "./components/JsonDisplay";
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0, ...sx }}>{children}</Box>}
    </div>
  );
}

function DocumentViewer({
  base64,
  documentData,
  formValues,
  setFormValues,
  scanType,
  autoFormValues,
  setAutoFormValues,
  docType,
  submitData,
  handleSubmit,
}) {
  const [formSelected, setFormSelected] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [value, setValue] = useState(0);
  const [selectedKeyPolygon, setSelectedKeyPolygon] = useState(null);
  const [selectedValuePolygon, setSelectedValuePolygon] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [region, setRegion] = useState(
    documentData.documents.length
      ? documentData.documents
      : documentData.keyValuePairs
  );
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    if (selectedButton === "words" && pageNumber !== 3) {
      setRegion(documentData.pages[pageNumber - 1].words);
    } else if (selectedButton === "lines" && pageNumber !== 3) {
      setRegion(documentData.pages[pageNumber - 1].lines);
    }
  }, [pageNumber, selectedButton, documentData]);

  console.log(selectedButton);

  const canvasRef = useRef(null);

  const handleFormClick = () => {
    setFormSelected(!formSelected);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const convertInchesToPixels = (inches, dpi = 96) => inches * dpi;

  const convertPolygon = (polygon, dpi) => {
    return polygon.map((point) => ({
      x: convertInchesToPixels(point.x, dpi),
      y: convertInchesToPixels(point.y, dpi),
    }));
  };

  if (!documentData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: "calc(100vh)" }}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item xs={6.5} style={{ height: "100%", overflow: "auto" }}>
          <PdfViewer
            base64String={base64}
            documentData={documentData}
            formValues={formValues}
            setSelectedKey={setSelectedKey}
            selectedKey={selectedKey}
            setFormValues={setFormValues}
            convertPolygon={convertPolygon}
            canvasRef={canvasRef}
            convertInchesToPixels={convertInchesToPixels}
            region={region}
            setAutoFormValues={setAutoFormValues}
            setPageNumber={setPageNumber}
            pageNumber={pageNumber}
            selectedKeyPolygon={selectedKeyPolygon}
            selectedValuePolygon={selectedValuePolygon}
            selectedButton={selectedButton}
            setRegion={setRegion}
          />
        </Grid>

        <Grid item xs={3} style={{ height: "100%", background: "white" }}>
          <div
            style={{
              background: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
              borderBottom: "1px solid #E7E7E8",
              padding: "0.5em",
              height: "64px", // Adjust height to match
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              bold
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0a9bcd', // Custom underline color
                },
              }}
            >
              <Tab
                sx={{ fontWeight: "bold" }}
                label="Fields"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ fontWeight: "bold" }}
                label="Mapping"
                {...a11yProps(1)}
              
              />
              <Tab sx={{ fontWeight: "bold" }} label="JSON" {...a11yProps(2)} />
            </Tabs>
          </div>
          <div style={{ height: "calc(100% - 85px)", overflow: "auto" }}>
            <TabPanel value={value} index={0} sx={{ p: 0 }}>
              <AutomatedForm
                documentData={documentData}
                scanType={scanType}
                autoFormValues={autoFormValues}
                setAutoFormValues={setAutoFormValues}
                setSelectedKey={setSelectedKey}
                setSelectedKeyPolygon={setSelectedKeyPolygon}
                setSelectedValuePolygon={setSelectedValuePolygon}
                handleSubmit={handleSubmit}
                pageNumber={pageNumber}
                setSelectedValue={setSelectedValue}
                setPageNumber={setPageNumber}
                docType={docType}
              />
            </TabPanel>
            <TabPanel value={value} index={1} sx={{ p: 0 }}>
              {documentData.keyValuePairs.map((keyValuePair) => (
                <p key={keyValuePair.key}>{keyValuePair.key}</p>
              ))}
            </TabPanel>
            <TabPanel value={value} index={2} sx={{ p: 0 }}>
              <JsonDisplay documentData={documentData} />
            </TabPanel>
          </div>
        </Grid>
        <Grid
          item
          xs={2.5}
          sx={{
            height: "100%",
            background: "white",
            border: "1px solid #E7E7E8",
            borderTop: "0px",
          }}
        >
          <div
            style={{
              background: "white",
              position: "sticky",
              top: 0,
              zIndex: 1,
              borderBottom: "1px solid #E7E7E8",
              padding: "0.5em",
              height: "64px", // Adjust height to match the Fields section
              display: "flex",
              alignItems: "center",
              boxShadow: "10px",
            }}
          >
            <Typography
              variant="h8"
              style={{
                color: "#757575",
                fontFamily: "manrope",
                fontWeight: "bold",
              }}
            >
              ACTIONS AND TOOLS
            </Typography>
          </div>

          <Toolbar
            setRegion={setRegion}
            region={region}
            documentData={documentData}
            handleSubmit={handleSubmit}
            selectedKey={selectedKey}
            value={value}
            selectedValue={selectedValue}
            pageNumber={pageNumber}
            setSelectedButton={setSelectedButton}
            selectedButton={selectedButton}
          />
          <ActionTab />
        </Grid>
      </Grid>
    </div>
  );
}

export default DocumentViewer;
