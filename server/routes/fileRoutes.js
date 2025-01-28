// dmsRoutes.mjs
import express from "express";
import multer from "multer";
import {
  uploadFile,

} from "../controllers/dmsController.mjs"; // Adjust the path as needed

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/fileupload", upload.single("file"), uploadFile);


export default router;
