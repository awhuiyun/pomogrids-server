import express from "express";
const router = express.Router();

import {
  getTasksByYear,
  getUnarchivedTasks,
  archiveTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  updateTaskAfterSession,
} from "../controllers/tasks";

router.post("/get-tasks-by-year", getTasksByYear);
router.post("/unarchived-tasks", getUnarchivedTasks);
router.patch("/archive-task", archiveTask);
router.post("/create", createNewTask);
router.patch("/update", updateExistingTask);
router.delete("/delete", deleteExistingTask);
router.patch("/session-complete", updateTaskAfterSession);

export { router };
