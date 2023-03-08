import express from "express";
const router = express.Router();
import {
  getUserTier,
  createNewAccount,
  upgradeUserTier,
} from "../controllers/users";

router.get("/get-user-tier", getUserTier);
router.patch("/upgrade-user-tier", upgradeUserTier);
router.patch("/create-new-account", createNewAccount);

export { router };
