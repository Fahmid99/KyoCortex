import { useState, useRef } from "react";
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
  pageNumber,
  setPageNumber,
  submitData,
  handleSubmit,
}) {
  const [formSelected, setFormSelected] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [value, setValue] = useState(0);
  const [selectedKeyPolygon, setSelectedKeyPolygon] = useState(null);
  const [selectedValuePolygon, setSelectedValuePolygon] = useState(null);

  const [region, setRegion] = useState(
    documentData.documents.length
      ? documentData.documents
      : documentData.keyValuePairs
  );

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
    <div style={{ height: "calc(100vh - 70px)" }}>
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
            >
              <Tab
                sx={{ fontWeight: "bold" }}
                label="Fields"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ fontWeight: "bold" }}
                label="Key Value Pairs"
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
            }}
          >
            <Typography
              variant="h7"
              style={{ color: "#757575", fontWeight: "bold" }}
            >
              Actions and tools
            </Typography>
          </div>
          <Divider />
          <Toolbar
            setRegion={setRegion}
            region={region}
            documentData={documentData}
            handleSubmit={handleSubmit}
          />
          <ActionTab />
        </Grid>
      </Grid>
    </div>
  );
}

export default DocumentViewer;
