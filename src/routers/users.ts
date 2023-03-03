import express from "express";
const router = express.Router();
import { createNewAccount } from "../controllers/users";

router.patch("/create-new-account", createNewAccount);

export { router };
