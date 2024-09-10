import { Button, Grid, Stack, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home"; // Replace with your desired icon
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
function Toolbar({ region, setRegion, documentData }) {
  return (
    <div>
      <Grid sx={{ border: "1px solid black" }}>
        <Button size="small">
          <Stack direction="column" alignItems="center">
            <AdsClickIcon />
            <Typography variant="caption">On Click Index</Typography>
          </Stack>
        </Button>
        <Button size="small">
          <Stack direction="column" alignItems="center">
            <HighlightAltIcon />
            <Typography variant="caption">Drag and Index</Typography>
          </Stack>
        </Button>
      </Grid>
      <Button
        onClick={() => {
          setRegion(documentData.pages[0].words);
        }}
      >
        words
      </Button>
      <Button
        onClick={() => {
          setRegion(documentData.pages[0].lines);
        }}
      >
        line
      </Button>
      <Button
        onClick={() => {
          setRegion(documentData.keyValuePairs);
        }}
      >
        Key Value Pairs
      </Button>
      <Button
        onClick={() => {
          setRegion(documentData.paragraphs);
        }}
      >
        Paragraphs
      </Button>
      <Button
        onClick={() => {
          setRegion(documentData.documents);
        }}
      >
        Other
      </Button>
    </div>
  );
}

export default Toolbar;
