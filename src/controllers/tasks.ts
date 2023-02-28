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

type GetTaskByYearPayload = {
  user_id: string;
  year: number;
};

// Function to get tasks by year
function getTasksByYear(req: Request, res: Response) {
  try {
    const { user_id, year } = req.body as GetTaskByYearPayload;

    db.query(
      "SELECT tasks.task_name, tasks_sessions.date_of_session, tasks_sessions.number_of_minutes FROM tasks_sessions JOIN tasks ON tasks_sessions.task_id = tasks.id WHERE tasks.user_id = (?) AND YEAR(tasks_sessions.date_of_session) = (?)",
      [user_id, year],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.send(result);
        }
      }
    );
  } catch (error) {
    console.error(" POST /tasks//get-tasks-by-year", error);
    return res.status(400).json({
      status: "error",
      message: "request to get tasks by year failed",
    });
  }
}

// Function to get incomplete tasks (as of yesterday)
function getIncompleteTasks(req: Request, res: Response) {}

// Function to create new tasks
function createNewTask(req: Request, res: Response) {}

// Function to update existing task
function updateExistingTask(req: Request, res: Response) {}

// Function to delete existing task
function deleteExistingTask(req: Request, res: Response) {}

// Function to update task after user completes a pomodoro session
function updateTaskAfterSession(req: Request, res: Response) {}

export {
  getTasks,
  getTasksByYear,
  getIncompleteTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  updateTaskAfterSession,
};
