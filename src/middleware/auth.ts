import * as admin from "firebase-admin";
import { Response, NextFunction } from "express";
import { UidRequest } from "../types/interface";

// export async function authenticate(
//   req: UidRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     try {
//       const idToken = authHeader.split(" ")[1];
//       const decodedToken = await admin.auth().verifyIdToken(idToken);
//       req.uid = decodedToken.uid;
//       req.email = decodedToken.email ?? "";
//       next();
//     } catch (error) {
//       console.log(error);
//       return res.sendStatus(401).json({
//         status: "error",
//         message: "unauthorized",
//       });
//     }
//   } else {
//     return res.status(403).json({
//       status: "error",
//       messsage: "missing token",
//     });
//   }
// }

export async function authenticateJWT(authorizationHeader: string | undefined) {
  const authHeader = authorizationHeader;

  if (authHeader) {
    try {
      const idToken = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.log(error);
      throw new Error("unauthorized");
    }
  } else {
    throw new Error("missing token");
  }
}

// export { authenticateJWT };
