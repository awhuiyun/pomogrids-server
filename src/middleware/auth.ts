import * as admin from "firebase-admin";
import { Response, NextFunction } from "express";
import { UidRequest } from "../types/interface";

async function authenticateJWT(
  req: UidRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      const idToken = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.uid = decodedToken.uid;
      next();
    } catch (error) {
      console.log(error);
      return res.sendStatus(401).json({
        status: "error",
        message: "unauthorized",
      });
    }
  } else {
    return res.status(403).json({
      status: "error",
      messsage: "missing token",
    });
  }
}

export { authenticateJWT };
