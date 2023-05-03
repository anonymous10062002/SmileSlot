require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {mongoDB}=require('./config/db');
const {client}=require('./config/db');
const {userRouter}=require('./routes/userRouter');

const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/users", userRouter);

app.listen(process.env.port, async () => {
  try {
    // mongoDb connection
    await mongoDB;
    console.log('MongoDB', true);

    // redis connection
    await client.connect();
    console.log('Redis', client.isReady);
  } 
  catch (error) {
    console.log(error);
  }
  console.log(`Running at:${process.env.port}`);
});