require("dotenv").config();

import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up connection to pomogrids database
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Get all tasks
function getTasks() {
  db.query("SELECT * FROM users", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
    }
  });
}

getTasks();

app.listen(process.env.PORT, () => {
  console.log("Server started on Port " + process.env.PORT);
});
