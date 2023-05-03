const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {mongoDB}=require('./config/db');
const {userRouter}=require('./routes/userRouter');

const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));

app.use("/users", userRouter);


app.listen(process.env.port, async () => {
  try {
    await mongoDB;
    console.log(`Running at PORT:${process.env.port}`);
  } catch (error) {
    console.log(error);
  }
});