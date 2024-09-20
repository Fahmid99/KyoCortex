// src/routes/fileRoutes.js
import { Router } from "express";
const router = Router();
import {
  uploadFile,
  getDocument,
  getVendors,
  getFileTypes,
  createObj,
  submitData,
  endProcess,
} from "../controllers/fileController";
import { single } from "../middlewares/uploadMiddleware.mjs";


router.post("/endprocess", endProcess);

export default router;
