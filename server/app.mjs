import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dmsRoutes from "./routes/dmsRoutes.mjs"; // Adjust the path as needed
import configRoutes from "./routes/configRoutes.mjs";
import dotenv from "dotenv";
import authenticateToken from "../server/middlewares/authenticateToken.mjs";
import fetchTenantInfo from "../server/middlewares/fetchTenantInfo.mjs";



dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the fetchTenantInfo middleware before all routes
app.use(fetchTenantInfo);

// Protect the /get-tenant-information route with the authenticateToken middleware
app.get('/api/get-tenant-information', authenticateToken, (req, res) => {
  tenantInfoFetched = true;
  res.send(req.tenantInfo);
});

// Use the authenticateToken middleware for other routes
app.use('/api', authenticateToken, dmsRoutes);
app.use('/api', authenticateToken, configRoutes);
// app.use('/api', authenticateToken, dcpRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});