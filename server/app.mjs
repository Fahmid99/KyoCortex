import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dmsRoutes from "./routes/dmsRoutes.mjs"; // Adjust the path as needed
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", dmsRoutes); // Prefix all routes with /api

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
