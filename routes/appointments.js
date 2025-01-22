const express = require("express");
const Appointment = require("../models/Appointment");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];   // accessing index 1 of array
  // Bearer eyJhbG----I6IkpXVCJ9.eyJzd----F0IjoxNTE2MjM5MDIyfQ.SflKxwRJ----SM_D3kwY3o2R4n6wJ0w

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = decoded; // Attach decoded token data to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Add Appointment (Professor)
router.post("/appointments", authenticate, async (req, res) => {    // /api/appointments
  const { time } = req.body;
  const professorId = req.user.id; // Extracted from the token

  try {
    const appointment = new Appointment({ professor: professorId, time });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View Available Appointments (Student)
router.get("/appointments", authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointments
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Book Appointment (Student)
router.patch("/appointments/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid appointment ID format" });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { student: studentId, status: "booked"},
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Student seeing his booked appointments
router.get("/appointments/my_booked", authenticate, async (req, res) => {
 const studentId = req.user.id; // Extract the student's ObjectId from the JWT payload

  try {
    const appointments = await Appointment.find({ student: studentId }); // Query appointments booked by the student
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel Appointment (Professor)
router.patch("/appointments/cancel/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { student: null, status: "canceled"},
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
