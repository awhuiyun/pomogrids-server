import express from "express";
const router = express.Router();

import { getSettings, updateSettings } from "../controllers/settings";

router.post("/get", getSettings);
router.patch("/update", updateSettings);

export { router };
