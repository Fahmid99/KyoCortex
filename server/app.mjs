import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dmsRoutes from "./routes/dmsRoutes.mjs"; // Adjust the path as needed
import configRoutes from "./routes/configRoutes.mjs"
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", dmsRoutes); // Prefix all routes with /api
app.use("/api", configRoutes); // Prefix all routes with /api

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
