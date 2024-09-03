import { useState } from "react";
import DocumentIcon from "../assets/document.png";
import AbbyLogo from "../assets/abbylogo.webp";
import InfoIcon from "@mui/icons-material/Info";
import Grid from "@mui/material/Grid2";
import { Select, MenuItem, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function UploadProcessCard({ isUploaded, currentDocument }) {
  const [selectedSkill, setSelectedSkill] = useState();
  const [showReviewButton, setShowReviewButton] = useState(false);
  const navigate = useNavigate(); 
  const handleSkillChange = (event) => {
    setSelectedSkill(event.target.value);
    setShowReviewButton(true);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2em",
        margin: "1em",
        borderRadius: "10px",
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        width: "200px",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <InfoIcon style={{ fontSize: 40, color: "#1976d2" }} />
            </Grid>
            <Grid item>
              <Typography>Select a skill</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <img src={DocumentIcon} style={{ width: "90px", height: "auto" }} />
        </Grid>
        <Grid item>
          <Select
            value={selectedSkill}
            onChange={handleSkillChange}
            displayEmpty
            sx={{ minWidth: 200, background: "white" }}
          >
            <MenuItem value="" disabled>
              Select Skill
            </MenuItem>
            <MenuItem value="skill1">Skill 1</MenuItem>
            <MenuItem value="skill2">Skill 2</MenuItem>
            <MenuItem value="skill3">Skill 3</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Typography>{currentDocument.name}</Typography>
        </Grid>
        <Grid item>
          <Button
            disabled={!selectedSkill}
            variant="contained"
            sx={{ boxShadow: "none" }}
            onClick={()=> {navigate("/frame")}}
          >
            Review
          </Button>
        </Grid>
        <Grid
          display={"flex"}
          flexDirection={"row"}
          sx={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            alignItems: "center",
          }}
        >
          <Typography sx={{ alignSelf: "center", fontWeight: "bold" }}>
            Powered By
          </Typography>
          <img src={AbbyLogo} style={{ width: "100px" }} />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UploadProcessCard;
