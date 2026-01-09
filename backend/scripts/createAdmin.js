const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const hashed = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin User",
    email: "admin@company.com",
    password: hashed,
    role: "admin",
    isVerified: true,
  });
  console.log("Admin created: admin@company.com / admin123");
  process.exit();
};

createAdmin();
