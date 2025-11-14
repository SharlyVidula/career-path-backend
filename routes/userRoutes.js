const express = require("express");
const router = express.Router();
const User = require("../models/user");

// REGISTER (plain text)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Store password as is
    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error });
  }
});

// LOGIN (plain text)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare plain passwords
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error });
  }
});

// TEST: Get all
router.get("/all", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
