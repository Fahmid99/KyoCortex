import express from "express";
import multer from "multer";
import {
  getMergedData,
  getConfigFormFields,
  updateMapping,
  convertFileToBase64,
} from "../controllers/configController.mjs"; // Adjust the path as needed

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/mergeddata", getMergedData);
router.get("/configformfields", getConfigFormFields);
router.put("/updatemapping", updateMapping);
router.post("/convertbase64", upload.single("file"), convertFileToBase64);

export default router;
