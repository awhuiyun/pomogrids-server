import express from "express";
const router = express.Router();
import { getUserTier, createNewAccount } from "../controllers/users";

router.get("/get-user-tier", getUserTier);
router.patch("/create-new-account", createNewAccount);

export { router };
