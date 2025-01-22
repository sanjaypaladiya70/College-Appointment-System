const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Professor = require("../models/Professor");

const router = express.Router();

router.post("/register/student", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const student = new Student({ name, email, password: hashedPassword });

  try {
    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/register/professor", async (req, res) => {
  const { name, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const professor = new Professor({ name, email, password: hashedPassword, department });

  try {
    await professor.save();
    res.status(201).json({ message: "Professor registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  const Model = role === "student" ? Student : Professor;

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password); // return true or false   // password is hashed
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
