const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { adminAuth } = require("../middleware/adminAuth");
const { authenticator } = require("../middleware/authenticator");

const { UserModel } = require("../models/UserModel");
// const { bookingModel } = require("../models/booking.model");

const adminRouter = express.Router();

require("dotenv").config();

adminRouter.post("/adminlogin", async (req, res) => {
  let { email, password } = req.body;
  try {
    if (email === process.env.adminId && password === process.env.adminPass) {
      let token = jwt.sign(
        { email: email, age: 20, role: "admin" },
        process.env.adminKey
      );
      res
        .status(200)
        .send({ token, adminData: { email: email, age: 20, role: "admin" } });
    } else {
      res
        .status(404)
        .send({ msg: "No user found with this eamil! Please register first." });
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

adminRouter.get("/getusers", adminAuth, async (req, res) => {
  try {
    const data = await UserModel.find();
    res.send({ msg: data });
  } catch (err) {
    res.send({ err: err.message });
  }
});

// adminRouter.post("/bookings", async (req, res) => {
//   const { email, pass } = req.body;
//   if (email === process.env.adminId && pass === process.env.adminPass) {
//     try {
//       const data = await bookingModel.find();
//       res.send({ msg: data });
//     } catch (err) {
//       res.send({ err: err.message });
//     }
//   } else {
//     res.send({ err: "You are not Authorized to go further." });
//   }
// });

module.exports = { adminRouter };
