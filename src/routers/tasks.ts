import express from "express";
const router = express.Router();

import {
  getTasks,
  getTasksByYear,
  getIncompleteTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  updateTaskAfterSession,
} from "../controllers/tasks";

// TEST
router.post("/", getTasks);

router.post("/get-tasks-by-year", getTasksByYear);
router.post("/incomplete-tasks", getIncompleteTasks);
router.post("/create", createNewTask);
router.patch("/update", updateExistingTask);
router.delete("/delete", deleteExistingTask);
router.patch("/session-complete", updateTaskAfterSession);

export { router };
