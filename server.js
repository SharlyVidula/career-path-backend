const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

const app = express();   // ✅ THIS MUST COME FIRST

// ---------- Security Middlewares ----------
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());

// Rate limiter (protects login + register)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

// ---------- Body Parsing ----------
app.use(express.json());

// ---------- CORS ----------
app.use(
  cors({
    origin: "*",        // You can change this to your frontend URL for more security
    credentials: true,
  })
);

// ---------- Routes ----------
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
