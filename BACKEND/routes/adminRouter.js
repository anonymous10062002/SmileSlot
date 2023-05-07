const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { adminAuth } = require("../middleware/adminAuth");


const { UserModel } = require("../models/UserModel");

const { ClinicModel } = require("../models/ClinicModel");

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

// get all clinics [clinic1,clinic2,clinic3.....]
adminRouter.get("/allclinics", adminAuth, async (req, res) => {
  try {
    const clinics = await ClinicModel.distinct("clinic");
    res.status(200).send(clinics);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = { adminRouter };
