const express = require("express");
const jwt = require("jsonwebtoken");
const { adminAuth } = require("../middleware/adminAuth");
const { UserModel } = require("../models/UserModel");
const { ClinicModel } = require('../models/ClinicModel');
const { SlotModel } = require("../models/SlotModel");

const adminRouter = express.Router();

require("dotenv").config();

// ADMIN LOGIN API
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

// GET ALL USERS API
adminRouter.get("/getusers", adminAuth, async (req, res) => {
  try {
    const data = await UserModel.find();
    if (data.length) {
      res.status(200).send(data);
    }
    else {
      res.status(404).send('No user found');
    }
  }
  catch (err) {
    console.log(err.message);
    res.sendStatus(400);
  }
});

// GET ALL CLINICS [clinic1,clinic2,clinic3.....]
adminRouter.get('/allclinics', adminAuth, async (req, res) => {
  try {

    const clinics = await ClinicModel.find();
    res.status(200).send({ msg: clinics });
  } catch (error) {
    res.status(400).send({ err: error.message });

  }
})

// GET ALL APPOINTMENTS [appointment1,appointment2,appointment3...]
adminRouter.get('/allappointments', adminAuth, async (req, res) => {
  try {
    const appointments = await SlotModel.find();
    if (appointments.length) {
      res.status(200).send(appointments);
    }
    else {
      res.status(404).send('No appointment found');
    }
  }
  catch (error) {
    // console.log(error.message);
    res.sendStatus(400);
  }
})

module.exports = { adminRouter };
