import { Response, Request } from "express";
import { authenticateJWT } from "../middleware/auth";
import { db } from "../db";

// Function to get settings
async function getSettings(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM settings WHERE user_id = (?)",
        [uid],
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
    console.error(" POST /settings/get", error);
    return res.status(400).json({
      status: "error",
      message: "request to get settings failed",
    });
  }
}

// Function to update settings
type UpdateSettingsPayload = {
  pomodoro_minutes: string;
  short_break_minutes: string;
  long_break_minutes: string;
  number_of_sessions_in_a_cycle: number;
  alarm_ringtone: string;
  alarm_volume: number;
};

async function updateSettings(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;
    const {
      pomodoro_minutes,
      short_break_minutes,
      long_break_minutes,
      number_of_sessions_in_a_cycle,
      alarm_ringtone,
      alarm_volume,
    } = req.body as UpdateSettingsPayload;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE settings SET pomodoro_minutes=(?), short_break_minutes=(?), long_break_minutes=(?),number_of_sessions_in_a_cycle=(?),alarm_ringtone=(?),alarm_volume=(?) WHERE user_id=(?)",
        [
          pomodoro_minutes,
          short_break_minutes,
          long_break_minutes,
          number_of_sessions_in_a_cycle,
          alarm_ringtone,
          alarm_volume,
          uid,
        ],
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve("Settings successfully updated!");
          }
        }
      );
    });

    res.send(result);
  } catch (error) {
    console.error(" PATCH /settings/update", error);
    return res.status(400).json({
      status: "error",
      message: "request to update settings failed",
    });
  }
}

export { getSettings, updateSettings };
