const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "Professor", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  time: { type: Date, required: true },
  status: { type: String, enum: ["not booked", "booked", "canceled"], default: "not booked" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
