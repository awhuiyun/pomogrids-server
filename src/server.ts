require("dotenv").config();

import express from "express";
import cors from "cors";
import { router as tasks } from "./routers/tasks";
import { router as settings } from "./routers/settings";
import { router as users } from "./routers/users";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/tasks", tasks);
app.use("/settings", settings);
app.use("/users", users);

// Setting up on Port
app.listen(process.env.PORT, () => {
  console.log("Server started on Port " + process.env.PORT);
});
