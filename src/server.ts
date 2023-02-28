require("dotenv").config();

import express from "express";
import cors from "cors";
import { router as tasks } from "./routers/tasks";
import { router as settings } from "./routers/settings";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/tasks", tasks);
app.use("/settings", settings);

app.listen(process.env.PORT, () => {
  console.log("Server started on Port " + process.env.PORT);
});
