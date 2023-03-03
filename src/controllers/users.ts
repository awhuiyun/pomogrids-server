import { Response, Request } from "express";
import { admin } from "../auth/firebase";

// Function to check if user exists in User table
async function checkIfUserExists(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const idToken = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      console.log(uid);
    }
  } catch (error) {
    console.log(error);
  }
}

export { checkIfUserExists };
