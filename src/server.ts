require("dotenv").config();

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(process.env.PORT, () => {
  console.log("Server started on Port " + process.env.PORT);
});
