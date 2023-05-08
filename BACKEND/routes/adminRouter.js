const express = require("express");
const jwt = require("jsonwebtoken");
const { adminAuth } = require("../middleware/adminAuth");
const { UserModel } = require("../models/UserModel");
const { ClinicModel } = require("../models/ClinicModel");
const { SlotModel } = require("../models/SlotModel");
const { client } = require("../config/db");

const adminRouter = express.Router();

require("dotenv").config();

// ADMIN LOGIN API
adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === process.env.adminId && password === process.env.adminPass) {
      const token = jwt.sign(
        { email, age: 20, role: "admin" },
        process.env.adminKey
      );
      res.status(200).send({ msg: "Logged in successfully", token });
    } else {
      res
        .status(404)
        .send({ err: "No user found with this eamil! Please register first." });
    }
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

// GET ALL USERS API
adminRouter.get("/getusers", adminAuth, async (req, res) => {
  try {
    const data = await UserModel.find();
    if (data.length) {
      res.status(200).send(data);
    } else {
      res.status(404).send("No user found");
    }
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

// BLOCK-USER API
adminRouter.patch("/blockuser/:userID", adminAuth, async (req, res) => {
  const userID = req.params.userID;
  try {
    await UserModel.findByIdAndUpdate(userID, {
      verified: false,
      blocked: true,
    });
    res.status(200).send({ msg: "User blocked successfully" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

// GET ALL CLINICS [clinic1,clinic2,clinic3.....]

adminRouter.get("/allclinics", adminAuth, async (req, res) => {
  try {
    const clinics = await ClinicModel.find();
    res.status(200).send({ msg: clinics });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

// GET ALL APPOINTMENTS [appointment1,appointment2,appointment3...]
adminRouter.get("/allappointments", adminAuth, async (req, res) => {
  try {
    const appointments = await SlotModel.find();
    if (appointments.length) {
      res.status(200).send(appointments);
    } else {
      res.status(404).send("No appointment found");
    }
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

// ADMIN LOGOUT API
adminRouter.get("/logout", adminAuth, async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  try {
    await client.SADD("blackTokens", accessToken);
    res.status(200).send({ msg: "Logged out successfully" });
  } catch (error) {
    res.status(400).send({ err: error.message });
  }
});

// Route for deleting a clinic by ID
adminRouter.delete("/clinic/:id", adminAuth, async (req, res) => {
  const clinicId = req.params.id;

  try {
    const result = await ClinicModel.findByIdAndDelete(clinicId);
    if (!result) {
      return res.status(404).send({ err: "Clinic not found" });
    }
    res.status(200).send({ msg: "Clinic deleted successfully" });
  } catch (error) {
    res.status(500).send({ err: error.message });
  }
});

module.exports = { adminRouter };
