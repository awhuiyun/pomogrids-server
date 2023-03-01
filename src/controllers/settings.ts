import { Response, Request } from "express";
import { db } from "../db";

// Function to get settings
type GetSettingsPayload = {
  user_id: string;
};

async function getSettings(req: Request, res: Response) {
  try {
    const { user_id } = req.body as GetSettingsPayload;

    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM settings WHERE user_id = (?)",
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
    console.error(" POST /settings/get", error);
    return res.status(400).json({
      status: "error",
      message: "request to get settings failed",
    });
  }
}

// Function to update settings
type UpdateSettingsPayload = {
  user_id: string;
  pomodoro_minutes: string;
  short_break_minutes: string;
  long_break_minutes: string;
  number_of_sessions_in_a_cycle: number;
  alarm_ringtone: string;
  alarm_volume: number;
};

async function updateSettings(req: Request, res: Response) {
  try {
    const {
      user_id,
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
          user_id,
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
