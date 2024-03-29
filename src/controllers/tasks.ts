import { Response, Request } from "express";
import { authenticateJWT } from "../middleware/auth";
import { db } from "../db";

// Function to get tasks by year
type GetTaskByYearPayload = {
  year: number;
};

type TaskItem = {
  task_name: string;
  date_of_session: string;
  number_of_minutes: number;
  category_name: string | null;
  category_colour: string | null;
};

type TaskItemResponse = {
  taskName: string;
  dateOfSession: string;
  completedNumOfMinutes: number;
  category_name: string | null;
  category_colour: string | null;
};

async function getTasksByYear(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const { year } = req.body as GetTaskByYearPayload;

    //  Query for result
    let db_result: TaskItem[] = await new Promise((resolve, reject) => {
      db.query<any[]>(
        "SELECT tasks.task_name, tasks_sessions.date_of_session, tasks_sessions.number_of_minutes, tasks.category_name, tasks.category_colour FROM tasks_sessions JOIN tasks ON tasks_sessions.task_id = tasks.id WHERE tasks.user_id = (?) AND tasks_sessions.year_of_session = (?)",
        [uid, year],
        (error, result) => {
          if (error) {
            return reject(error); // error will be caught at "catch"
          } else {
            return resolve(result);
          }
        }
      );
    });

    // Manipulate the result:
    // Change date to local time:
    const db_result_edited: TaskItemResponse[] = [];

    db_result.forEach((item) => {
      const revised_item = {
        taskName: item.task_name,
        dateOfSession: new Date(item.date_of_session)
          .toLocaleString()
          .split(",")[0],
        completedNumOfMinutes: item.number_of_minutes,
        category_name: item.category_name,
        category_colour: item.category_colour,
      };

      db_result_edited.push(revised_item);
    });

    return res.send(db_result_edited);
  } catch (error) {
    console.error(" POST /tasks/get-tasks-by-year", error);
    return res.status(400).json({
      status: "error",
      message: "request to get tasks by year failed",
    });
  }
}

// Function to get unarchived tasks
type UnarchivedTaskItem = {
  user_id: string;
  task_id: string;
  task_name: string;
  target_num_of_sessions: number;
  completed_num_of_sessions: number;
  completed_num_of_minutes: number;
  category_name: string | null;
  category_colour: string | null;
  is_archived: number;
};

type ModifiedUnarchivedTaskItem = {
  uniqueId: string;
  taskName: string;
  targetNumOfSessions: number;
  completedNumOfSessions: number;
  category_name: string | null;
  category_colour: string | null;
  isArchived: boolean;
  isCompleted: boolean;
  isSelectedForTimer: boolean;
  isSelectedForEdit: boolean;
};

async function getUnarchivedTasks(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;

    // Query for raw results
    const result: UnarchivedTaskItem[] = await new Promise(
      (resolve, reject) => {
        db.query<any[]>(
          "SELECT user_id, id as task_id, task_name, target_num_of_sessions, category_name, category_colour, SUM(tasks_sessions.number_of_sessions) as completed_num_of_sessions, is_archived FROM tasks LEFT JOIN tasks_sessions ON tasks.id = tasks_sessions.task_id GROUP BY id HAVING tasks.user_id = (?) AND tasks.is_archived = (?)",
          [uid, false],
          (error, result) => {
            if (error) {
              return reject(error);
            } else {
              return resolve(result);
            }
          }
        );
      }
    );

    // Manipulate the result:
    const response: ModifiedUnarchivedTaskItem[] = [];

    result.forEach((item) => {
      const revised_item = {
        uniqueId: item.task_id,
        taskName: item.task_name,
        targetNumOfSessions: item.target_num_of_sessions,
        completedNumOfSessions: Number(item.completed_num_of_sessions) ?? 0,
        category_name: item.category_name,
        category_colour: item.category_colour,
        isArchived: false,
        isCompleted: false,
        isSelectedForTimer: false,
        isSelectedForEdit: false,
      };

      // Edit isCompleted
      if (
        revised_item.completedNumOfSessions >= revised_item.targetNumOfSessions
      ) {
        revised_item.isCompleted = true;
      }

      response.push(revised_item);
    });

    return res.send(response);
  } catch (error) {
    console.error(" POST /tasks/unarchived-tasks", error);
    return res.status(400).json({
      status: "error",
      message: "request to get unarchived tasks failed",
    });
  }
}

// Function to archive a task
type ArchiveTaskPayload = {
  task_id: string;
};

async function archiveTask(req: Request, res: Response) {
  try {
    // Authenticate jwt
    await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const { task_id } = req.body as ArchiveTaskPayload;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE tasks SET is_archived = (?) WHERE id=(?)",
        [true, task_id],
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve("Existing task successfully archived!");
          }
        }
      );
    });

    return res.send(result);
  } catch (error) {
    console.error(" PATCH /tasks/archive-task", error);
    return res.status(400).json({
      status: "error",
      message: "request to archive task failed",
    });
  }
}

// Function to create new tasks
type CreateNewTaskPayload = {
  task_id: string;
  task_name: string;
  target_num_of_sessions: string;
  category_name?: string;
  category_colour?: string;
};

async function createNewTask(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const {
      task_id,
      task_name,
      target_num_of_sessions,
      category_name,
      category_colour,
    } = req.body as CreateNewTaskPayload;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO tasks (id, task_name, target_num_of_sessions, is_archived, user_id, category_name, category_colour) VALUES ((?), (?), (?), (?), (?), (?), (?))",
        [
          task_id,
          task_name,
          target_num_of_sessions,
          false,
          uid,
          category_name,
          category_colour,
        ],
        (error, result) => {
          if (error) {
            return reject(error); // error will be caught at "catch"
          } else {
            return resolve("New task successfully created!");
          }
        }
      );
    });

    return res.send(result);
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
  task_id: string;
  task_name: string;
  target_num_of_sessions: string;
  category_name?: string;
  category_colour?: string;
};

async function updateExistingTask(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const {
      task_id,
      task_name,
      target_num_of_sessions,
      category_name,
      category_colour,
    } = req.body as UpdateExistingTaskPayload;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE tasks SET task_name = (?), target_num_of_sessions= (?), category_name= (?), category_colour= (?) WHERE user_id= (?) AND id=(?)",
        [
          task_name,
          target_num_of_sessions,
          category_name,
          category_colour,
          uid,
          task_id,
        ],
        (error, result) => {
          if (error) {
            return reject(error); // error will be caught at "catch"
          } else {
            return resolve("Existing task successfully updated!");
          }
        }
      );
    });

    return res.send(result);
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
  task_id: string;
};

async function deleteExistingTask(req: Request, res: Response) {
  try {
    // Authenticate jwt
    await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const { task_id } = req.body as DeleteExistingTaskPayload;

    // Delete from tasks_sessions table
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM tasks_sessions WHERE task_id=(?)",
        [task_id],
        (error, result) => {
          if (error) {
            return reject(error); // error will be caught at "catch"
          } else {
            return resolve("Task successfully deleted!");
          }
        }
      );
    });

    // Delete from tasks table
    const result_tasks = await new Promise((resolve, reject) => {
      db.query("DELETE FROM tasks WHERE id=(?)", [task_id], (error, result) => {
        if (error) {
          return reject(error); // error will be caught at "catch"
        } else {
          return resolve("Task successfully deleted!");
        }
      });
    });

    return res.send(result_tasks);
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
    // Authenticate jwt
    await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const { task_id, number_of_sessions, number_of_minutes } =
      req.body as UpdateTaskAfterSessioPayload;

    // Get current num_of_sessions and num_of_minutes of today: To check if the task has been worked on
    const today_date = new Date().toISOString();
    const today_year = parseInt(today_date.split("T")[0].split("-")[0]);
    const today_month = parseInt(today_date.split("T")[0].split("-")[1]);
    const today_day = parseInt(today_date.split("T")[0].split("-")[2]);
    let current_num_of_sessions = 0;
    let current_num_of_minutes = 0;
    console.log(today_year, today_month, today_day);
    await new Promise((resolve, reject) => {
      db.query<any[]>(
        "SELECT number_of_sessions, number_of_minutes FROM tasks_sessions WHERE task_id=(?) AND year_of_session = (?) AND month_of_session = (?) AND day_of_session = (?)",
        [task_id, today_year, today_month, today_day],
        (error, result) => {
          if (error) {
            return reject(error); // error will be caught at "catch"
          } else {
            if (result.length > 0) {
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

    // Task has been worked on for the day: Update
    if (current_num_of_sessions > 0) {
      const updated_num_of_sessions =
        current_num_of_sessions + number_of_sessions;
      const updated_num_of_minutes = current_num_of_minutes + number_of_minutes;

      const result = new Promise((resolve, reject) => {
        db.query(
          "UPDATE tasks_sessions SET number_of_sessions=(?), number_of_minutes=(?) WHERE task_id=(?) AND year_of_session = (?) AND month_of_session = (?) AND day_of_session = (?)",
          [
            updated_num_of_sessions,
            updated_num_of_minutes,
            task_id,
            today_year,
            today_month,
            today_day,
          ],
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

      return res.send(result);
    } // Task has not been worked on the day: Create new row
    else {
      const result = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO tasks_sessions (task_id,number_of_sessions, number_of_minutes, date_of_session, year_of_session, month_of_session, day_of_session ) VALUE ((?),(?),(?),(?),(?),(?),(?))",
          [
            task_id,
            number_of_sessions,
            number_of_minutes,
            today_date,
            today_year,
            today_month,
            today_day,
          ],
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

      return res.send(result);
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
  getUnarchivedTasks,
  archiveTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  updateTaskAfterSession,
};
