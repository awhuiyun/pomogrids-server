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
type GetTaskByYearPayload = {
  user_id: string;
  year: number;
};

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
    console.error(" POST /tasks/get-tasks-by-year", error);
    return res.status(400).json({
      status: "error",
      message: "request to get tasks by year failed",
    });
  }
}

// Function to get incomplete tasks (as of yesterday)
type GetIncompleteTasksPayload = {
  user_id: string;
  yesterday_year: number;
  yesterday_month: number;
  yesterday_day: number;
};

function getIncompleteTasks(req: Request, res: Response) {
  try {
    const { user_id, yesterday_year, yesterday_month, yesterday_day } =
      req.body as GetIncompleteTasksPayload;

    db.query(
      "SELECT tasks.task_name, tasks_sessions.date_of_session, tasks_sessions.number_of_minutes FROM tasks_sessions JOIN tasks ON tasks_sessions.task_id = tasks.id WHERE tasks.user_id = (?) AND YEAR(tasks_sessions.date_of_session) = (?)",
      [user_id],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.send(result);
        }
      }
    );
  } catch (error) {
    console.error(" POST /tasks/incomplete-tasks", error);
    return res.status(400).json({
      status: "error",
      message: "request to get incomplete tasks failed",
    });
  }
}

// Function to create new tasks
type CreateNewTaskPayload = {
  user_id: string;
  task_name: string;
  target_num_of_sessions: string;
  completed_num_of_sessions: string;
  is_completed: boolean;
  category_name?: string;
  category_colour?: string;
};

function createNewTask(req: Request, res: Response) {
  try {
    const {
      user_id,
      task_name,
      target_num_of_sessions,
      completed_num_of_sessions,
      is_completed,
      category_name,
      category_colour,
    } = req.body as CreateNewTaskPayload;

    db.query(
      "INSERT INTO tasks (task_name, target_num_of_sessions, completed_num_of_sessions, is_completed, user_id, category_name, category_colour) VALUES ((?), (?), (?), (?), (?), (?), (?))",
      [
        task_name,
        target_num_of_sessions,
        completed_num_of_sessions,
        is_completed,
        user_id,
        category_name,
        category_colour,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.send("New task successfully created!");
        }
      }
    );
  } catch (error) {
    console.error(" POST /tasks/create", error);
    return res.status(400).json({
      status: "error",
      message: "request to create new task failed",
    });
  }
}

// Function to update existing task
type UpdateExistingTaskPayload = {
  user_id: string;
  task_id: string;
  task_name: string;
  target_num_of_sessions: string;
  is_completed: boolean;
  category_name?: string;
  category_colour?: string;
};

function updateExistingTask(req: Request, res: Response) {
  try {
    const {
      user_id,
      task_id,
      task_name,
      target_num_of_sessions,
      is_completed,
      category_name,
      category_colour,
    } = req.body as UpdateExistingTaskPayload;

    db.query(
      "UPDATE tasks SET task_name = (?), target_num_of_sessions= (?), is_completed= (?), category_name= (?), category_colour= (?) WHERE user_id= (?) AND id=(?)",
      [
        task_name,
        target_num_of_sessions,
        is_completed,
        category_name,
        category_colour,
        user_id,
        task_id,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          res.send("Existing task successfully updated!");
        }
      }
    );
  } catch (error) {
    console.error(" PATCH /tasks/update", error);
    return res.status(400).json({
      status: "error",
      message: "request to update existing task failed",
    });
  }
}

// Function to delete existing task
function deleteExistingTask(req: Request, res: Response) {
  try {
    // const { user_id, yesterday_year, yesterday_month, yesterday_day } =
    //   req.body as GetIncompleteTasksPayload;
    // db.query(
    //   "SELECT tasks.task_name, tasks_sessions.date_of_session, tasks_sessions.number_of_minutes FROM tasks_sessions JOIN tasks ON tasks_sessions.task_id = tasks.id WHERE tasks.user_id = (?) AND YEAR(tasks_sessions.date_of_session) = (?)",
    //   [user_id],
    //   (error, result) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       res.send(result);
    //     }
    //   }
    // );
  } catch (error) {
    // console.error(" POST /tasks/incomplete-tasks", error);
    // return res.status(400).json({
    //   status: "error",
    //   message: "request to get incomplete tasks failed",
    // });
  }
}

// Function to update task after user completes a pomodoro session
function updateTaskAfterSession(req: Request, res: Response) {
  try {
    // const { user_id, yesterday_year, yesterday_month, yesterday_day } =
    //   req.body as GetIncompleteTasksPayload;
    // db.query(
    //   "SELECT tasks.task_name, tasks_sessions.date_of_session, tasks_sessions.number_of_minutes FROM tasks_sessions JOIN tasks ON tasks_sessions.task_id = tasks.id WHERE tasks.user_id = (?) AND YEAR(tasks_sessions.date_of_session) = (?)",
    //   [user_id],
    //   (error, result) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       res.send(result);
    //     }
    //   }
    // );
  } catch (error) {
    // console.error(" POST /tasks/incomplete-tasks", error);
    // return res.status(400).json({
    //   status: "error",
    //   message: "request to get incomplete tasks failed",
    // });
  }
}

export {
  getTasks,
  getTasksByYear,
  getIncompleteTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  updateTaskAfterSession,
};
