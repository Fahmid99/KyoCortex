const crypto = require('crypto');

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier) {
  return crypto.createHash('sha256')
               .update(codeVerifier)
               .digest('base64url');
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

console.log('Code Verifier:', codeVerifier);
console.log('Code Challenge:', codeChallenge);