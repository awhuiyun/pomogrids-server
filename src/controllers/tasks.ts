import { Response, Request } from "express";
import { db } from "../db";

// Function to get tasks by year
type GetTaskByYearPayload = {
  user_id: string;
  year: number;
};

async function getTasksByYear(req: Request, res: Response) {
  try {
    const { user_id, year } = req.body as GetTaskByYearPayload;

    // Convert local time to UTC timezone:
    const start_date = new Date(year + "-01-01");
    const end_date = new Date(year + "-03-01");

    console.log(start_date, end_date);

    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT tasks.task_name, tasks_sessions.date_of_session, tasks_sessions.number_of_minutes, tasks.category_name, tasks.category_colour FROM tasks_sessions JOIN tasks ON tasks_sessions.task_id = tasks.id WHERE tasks.user_id = (?) AND tasks_sessions.date_of_session >= (?) AND tasks_sessions.date_of_session <= (?) ",
        [user_id, start_date, end_date],
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        }
      );
    });
    res.send(result);
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

async function getIncompleteTasks(req: Request, res: Response) {
  try {
    const { user_id, yesterday_year, yesterday_month, yesterday_day } =
      req.body as GetIncompleteTasksPayload;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT tasks.task_name, tasks_sessions.date_of_session, tasks_sessions.number_of_minutes FROM tasks_sessions JOIN tasks ON tasks_sessions.task_id = tasks.id WHERE tasks.user_id = (?) AND YEAR(tasks_sessions.date_of_session) = (?)",
        [user_id],
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        }
      );
    });

    res.send(result);
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

async function createNewTask(req: Request, res: Response) {
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

    const result = await new Promise((resolve, reject) => {
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
            return reject(error);
          } else {
            return resolve("New task successfully created!");
          }
        }
      );
    });
    res.send(result);
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

async function updateExistingTask(req: Request, res: Response) {
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

    const result = await new Promise((resolve, reject) => {
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
            return reject(error);
          } else {
            return resolve("Existing task successfully updated!");
          }
        }
      );
    });

    res.send(result);
  } catch (error) {
    console.error(" PATCH /tasks/update", error);
    return res.status(400).json({
      status: "error",
      message: "request to update existing task failed",
    });
  }
}

// Function to delete existing task
type DeleteExistingTaskPayload = {
  user_id: string;
  task_id: string;
};

function deleteExistingTask(req: Request, res: Response) {
  try {
    const { user_id, task_id } = req.body as DeleteExistingTaskPayload;

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
    console.error(" DELETE /tasks/delete", error);
    return res.status(400).json({
      status: "error",
      message: "request to delete existing task failed",
    });
  }
}

// Function to update task after user completes a pomodoro session
type UpdateTaskAfterSessioPayload = {
  task_id: string;
  number_of_sessions: number;
  number_of_minutes: number;
};

async function updateTaskAfterSession(req: Request, res: Response) {
  try {
    const { task_id, number_of_sessions, number_of_minutes } =
      req.body as UpdateTaskAfterSessioPayload;

    // Get current num_of_sessions and num_of_minutes of today: To check if the task has been worked on
    const today_date = new Date().toISOString();
    const today_year = parseInt(today_date.split("T")[0].split("-")[0]);
    const today_month = parseInt(today_date.split("T")[0].split("-")[1]);
    const today_day = parseInt(today_date.split("T")[0].split("-")[2]);
    let current_num_of_sessions = 0;
    let current_num_of_minutes = 0;

    await new Promise((resolve, reject) => {
      db.query<any[]>(
        "SELECT number_of_sessions, number_of_minutes FROM tasks_sessions WHERE task_id=(?) AND YEAR(tasks_sessions.date_of_session) = (?) AND MONTH(tasks_sessions.date_of_session) = (?) AND DAY(tasks_sessions.date_of_session) = (?)",
        [task_id, today_year, today_month, today_day],
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            if (result.length > 0) {
              console.log(result);
              current_num_of_sessions = result[0].number_of_sessions;
              current_num_of_minutes = result[0].number_of_minutes;
            } else {
              current_num_of_sessions = 0;
              current_num_of_minutes = 0;
            }
            return resolve("queried");
          }
        }
      );
    });

    if (current_num_of_sessions > 0) {
      const updated_num_of_sessions =
        current_num_of_sessions + number_of_sessions;
      const updated_num_of_minutes = current_num_of_minutes + number_of_minutes;

      const result = new Promise((resolve, reject) => {
        db.query(
          "UPDATE tasks_sessions SET number_of_sessions=(?), number_of_minutes=(?) WHERE task_id=(?)",
          [updated_num_of_sessions, updated_num_of_minutes, task_id],
          (error, result) => {
            if (error) {
              return reject(error);
            } else {
              return resolve(
                "Task successfully updated after completed session!"
              );
            }
          }
        );
      });
      res.send(result);
    } else {
      const result = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO tasks_sessions (task_id,number_of_sessions, number_of_minutes ) VALUE ((?),(?),(?))",
          [task_id, number_of_sessions, number_of_minutes],
          (error, result) => {
            if (error) {
              return reject(error);
            } else {
              return resolve(
                "Task successfully updated after completed session!"
              );
            }
          }
        );
      });
      res.send(result);
    }
  } catch (error) {
    console.error(" PATCH /tasks/session-complete", error);
    return res.status(400).json({
      status: "error",
      message: "request to update task after session failed",
    });
  }
}

export {
  getTasksByYear,
  getIncompleteTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  updateTaskAfterSession,
};
