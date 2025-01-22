const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);         // http://localhost:3000/auth/login
app.use("/api", appointmentRoutes);   // http://localhost:3000/api/appointments

app.get("/" , (req,res)=>{
    res.send("Welcome to my college appointment system backend project")
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
