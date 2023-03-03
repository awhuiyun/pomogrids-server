require("dotenv").config();

import express from "express";
import { Response, Request } from "express";
import cors from "cors";
import { router as tasks } from "./routers/tasks";
import { router as settings } from "./routers/settings";
// import { router as users } from "./routers/users";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/tasks", tasks);
app.use("/settings", settings);
// app.use("/users", users);

// Firebase endpoints
import * as admin from "firebase-admin";
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/users/", async (req: Request, res: Response) => {
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
});

// Setting up on Port
app.listen(process.env.PORT, () => {
  console.log("Server started on Port " + process.env.PORT);
});
