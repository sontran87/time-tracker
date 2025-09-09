// src/routes/auth.js
// Đăng nhập, đổi mật khẩu (không require token cho login, có cho đổi password)

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Thiếu thông tin" });
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
  }
  // Tạo token JWT
  const token = jwt.sign({
    id: user.id,
    username: user.username,
    role: user.role,
    full_name: user.full_name
  }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    token,
    role: user.role,
    name: user.full_name,
    username: user.username
  });
});

// Đổi mật khẩu (user đã đăng nhập)
router.post("/change-password", auth, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: "Thiếu mật khẩu mới" });
  await User.update(
    { password_hash: bcrypt.hashSync(newPassword, 10) },
    { where: { id: req.user.id } }
  );
  return res.json({ message: "Đổi mật khẩu thành công" });
});

module.exports = router;
