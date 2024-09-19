import React, { useState } from "react";
import {
  Card,
  Checkbox,
  FormControl,
  Link,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ReCAPTCHA from "react-google-recaptcha";
import MicrosoftSignInButton from "../../components/MicrosoftSignInButton";
import { useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";

function AbbySignInPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
  };
console.log("dwqd:")
  const handleLoggedIn = async () => {
    try {
      console.log("Button clicked");
      console.log("Username:", username);
      console.log("Password:", password);
      await documentService.signInKeim(username, password);
      console.log("Sign-in successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "linear-gradient(20deg, #64b5f6 0%, rgba(0, 123, 255, 0) 100%)",
      }}
    >
      <Card
        sx={{
          padding: "2em",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <FormControl>
            <Grid item xs={12} textAlign="center" margin="0.3">
              <Typography
                variant="h5"
                gutterBottom
                color="#424242"
                fontWeight={"600"}
              >
                Sign in to KyoCortex
              </Typography>
            </Grid>
            <Grid item xs={12} margin="0.5em">
              <TextField
                id="outlined-basic"
                label="Email or username"
                variant="standard"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} margin="0.5em">
              <TextField
                id="outlined-basic"
                label="Password"
                type="password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginTop="1em"
            >
              <Box display="flex" alignItems="center">
                <Checkbox />
                <Typography fontSize="14px">Stay signed in</Typography>
              </Box>
              <Link fontSize="14px">Forgot password?</Link>
            </Grid>
            <Grid item xs={12} textAlign="center" marginTop="1em">
              <ReCAPTCHA
                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                onChange={handleCaptchaChange}
              />
            </Grid>
            <Grid item xs={12} textAlign="center" marginTop="1em">
              <Button
                variant="contained"
                size="large"
                sx={{ boxShadow: "none", width: "100%" }}
                onClick={handleLoggedIn}
              >
                Sign In
              </Button>
            </Grid>
            <Grid textAlign="center" margin="1.5em" fontSize="12px">
              or
            </Grid>
            <Grid textAlign="center">
              <MicrosoftSignInButton />
            </Grid>
          </FormControl>
        </Grid>
        <Grid textAlign="center">
          <Link fontSize="14px">Create free account</Link>
        </Grid>
      </Card>
    </div>
  );
}

export default AbbySignInPage;
