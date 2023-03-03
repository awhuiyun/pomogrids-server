import { RowDataPacket } from "mysql2";
import { admin } from "../auth/firebase";
import { Request, Response } from "express";
import { db } from "../db";

// Function to check if user exists in User table
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
      console.log(uid, email);

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
      const result = await new Promise((resolve, reject) => {
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

      return res.send(result);
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

export { createNewAccount };
