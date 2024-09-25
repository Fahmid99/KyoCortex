import express from "express";

import { getMergedData, getConfigFormFields, updateMapping } from "../controllers/configController.mjs"; // Adjust the path as needed

const router = express.Router();

router.get("/mergeddata", getMergedData);
router.get("/configformfields", getConfigFormFields);
router.put("/updatemapping", updateMapping);


export default router;
