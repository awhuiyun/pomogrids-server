import express from "express";
const router = express.Router();

import { checkIfUserExists } from "../controllers/users";

router.post("/check-if-user-exists", checkIfUserExists);

export { router };
