const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

const clientID = 'your_client_id';
const clientSecret = 'your_client_secret';
const redirectURI = 'http://localhost:3000/auth/example/callback';
const scope = 'openid';
const tenantName = 'your_tenant_name';
const region = 'us'; // or 'eu', 'ta', 'as', 'jp', 'au', 'sandbox'

// Function to generate a code verifier
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

// Function to generate a code challenge from the code verifier
function generateCodeChallenge(codeVerifier) {
  return crypto.createHash('sha256')
               .update(codeVerifier)
               .digest('base64url');
}

// Generate the code verifier and code challenge
const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

console.log('Code Verifier:', codeVerifier);
console.log('Code Challenge:', codeChallenge);

// Construct the authorization URL
const authorizationURL = `https://www.example.com/auth/v1/authorize?response_type=code&client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectURI)}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${scope}`;

console.log('Authorization URL:', authorizationURL);

// Route to redirect the user to the authorization URL
app.get('/auth/example', (req, res) => {
  res.redirect(authorizationURL);
});

// Function to exchange the authorization code for an access token
async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post('https://www.example.com/auth/v1/token', {
      client_id: clientID,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier
    }, {
      headers: {
        'X-Tenant-Name': tenantName,
        'X-Region': region
      }
    });

    console.log('Access Token:', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
  }
}

// Route to handle the callback and exchange the authorization code for an access token
app.get('/auth/example/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Authorization code not found');
  }

  const tokenData = await exchangeCodeForToken(code);
  if (tokenData) {
    res.send('Access Token: ' + tokenData.access_token);
  } else {
    res.status(500).send('Failed to exchange code for token');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});