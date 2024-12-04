let accessToken = null;
let tokenExpiry = 0;

const fetchAccessToken = async () => {
  // Dummy values for testing
  accessToken = 'newAccessToken'; // Replace with actual token fetching logic
  tokenExpiry = Date.now() + 900 * 1000; // Token expires in 900 seconds (15 minutes)
};

const authenticateToken = async (req, res, next) => {
  if (!accessToken || Date.now() >= tokenExpiry) {
    try {
      await fetchAccessToken();
    } catch (error) {
      return res.status(500).send('Error fetching access token');
    }
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token !== accessToken) return res.status(403).send('Error: Not valid');

  req.user = { token }; // Attach token info to the request object
  next();
};

export default authenticateToken;