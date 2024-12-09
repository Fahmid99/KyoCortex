// dmsRoutes.mjs
import express from "express";
import multer from "multer";
import {
  uploadFile,
  getDocument,
  getVendors,
  getFileTypes,
  createObj,
  submitData,
  endProcess,
  signIn,
  getAllTypes
} from "../controllers/dmsController.mjs"; // Adjust the path as needed

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/document", getDocument);
router.get("/vendors", getVendors);
router.get("/filetypes", getFileTypes);
router.post("/createObj", upload.single("file"), createObj);
router.put("/submit/:id", submitData);
router.post("/endprocess", endProcess);
router.get("/signinkeim", signIn);
router.get("/alltypes", getAllTypes);

export default router;
