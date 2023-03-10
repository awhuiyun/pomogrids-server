import { RowDataPacket } from "mysql2";
import { admin } from "../auth/firebase";
import { Request, Response } from "express";
import { db } from "../db";
import { authenticateJWT } from "../middleware/auth";

// Function to retrieve user's tier
interface IUserTier {
  tier: "premiun" | "basic";
}

async function getUserTier(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;

    // Query for result
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT tier FROM users WHERE id = (?)",
        [uid],
        (error, result) => {
          if (error) {
            return reject(error); // error will be caught at "catch"
          } else {
            return resolve(result);
          }
        }
      );
    });

    return res.send(result);
  } catch (error) {
    console.error(" POST /users/get-user-tier", error);
    return res.status(400).json({
      status: "error",
      message: "request to get user's tier failed",
    });
  }
}

// Function to upgrade user tier
async function upgradeUserTier(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const decodedToken = await authenticateJWT(req.headers.authorization);

    // User successfully authenticated
    const uid = decodedToken.uid;

    // Query for result
    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET tier = 'premium' WHERE id = (?)",
        [uid],
        (error, result) => {
          if (error) {
            return reject(error); // error will be caught at "catch"
          } else {
            return resolve("Successfully upgraded user!");
          }
        }
      );
    });

    // const responseMessage = {
    //   message: result,
    // };

    return res.send(result);
  } catch (error) {
    console.error(" PATCH /users/upgrade-user-tier", error);
    return res.status(400).json({
      status: "error",
      message: "request to upgrade user's tier failed",
    });
  }
}

// Function to create new account
export interface IUserId extends RowDataPacket {
  id: string;
}

async function createNewAccount(req: Request, res: Response) {
  try {
    // Authenticate jwt
    const authHeader = req.headers.authorization;
    let uid: string;
    let email: string;

    // User is authenticated
    if (authHeader) {
      const idToken = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      uid = decodedToken.uid;
      email = decodedToken.email ?? "";

      // Check if user account exists
      const user = await new Promise<IUserId[]>((resolve, reject) => {
        db.query<IUserId[]>(
          "SELECT id FROM users WHERE id = (?)",
          [uid],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      // If user already exists, do nothing
      if (user.length !== 0) {
        return res.send("User account already exists!");
      }

      // If user does not exist, create new account for user
      // Create a new record in Users table
      const newUser = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO users (id, email, tier) VALUES ((?), (?), (?))",
          [uid, email, "basic"],
          (error, result) => {
            if (error) {
              return reject(error);
            } else {
              return resolve("New user successfully created!");
            }
          }
        );
      });

      // Create a new record in Settings table
      const newUserSettings = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO settings (user_id, pomodoro_minutes, short_break_minutes,long_break_minutes, number_of_sessions_in_a_cycle, alarm_ringtone, alarm_volume, week_start ) VALUES ((?), (?), (?), (?), (?), (?), (?), (?))",
          [uid, 25, 5, 15, 4, "buzzer", 0.5, "monday"],
          (error, result) => {
            if (error) {
              return reject(error);
            } else {
              return resolve("New user successfully created!");
            }
          }
        );
      });

      return res.send(newUserSettings);
    } // User is not authenticated
    else {
      return res.sendStatus(401).json({
        status: "error",
        message: "unauthorized",
      });
    }
  } catch (error) {
    console.error(" PATCH /users/create-new-account", error);
    return res.status(400).json({
      status: "error",
      message: "request to create new account failed",
    });
  }
}

export { createNewAccount, getUserTier, upgradeUserTier };
