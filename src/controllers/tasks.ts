import { Response, Request } from "express";
import { db } from "../db";

// TEST
function getTasks(req: Request, res: Response) {
  db.query("SELECT * FROM users", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result);
    }
  });
}

// Function to get tasks by year
function getTasksByYear() {}

// Function to get incomplete tasks (as of yesterday)
function getIncompleteTasks() {}

// Function to create new tasks
function createNewTask() {}

// Function to update existing task
function updateExistingTask() {}

// Function to delete existing task
function deleteExistingTask() {}

// Function to update task after user completes a pomodoro session
function updateTaskAfterSession() {}

export {
  getTasks,
  getTasksByYear,
  getIncompleteTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  updateTaskAfterSession,
};
