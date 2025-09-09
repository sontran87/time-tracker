// src/routes/users.js
// CRUD user, chỉ admin được phép

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { auth, adminOnly } = require("../middleware/auth");

// Lấy danh sách user
router.get("/", auth, adminOnly, async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ["password_hash"] } });
  res.json(users);
});

// Thêm user mới
router.post("/", auth, adminOnly, async (req, res) => {
  const { username, password, full_name, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: "Thiếu thông tin" });
  const existed = await User.findOne({ where: { username } });
  if (existed) return res.status(400).json({ message: "Username đã tồn tại" });

  await User.create({
    username,
    password_hash: bcrypt.hashSync(password, 10),
    full_name: full_name || username,
    role
  });
  res.json({ message: "Tạo user thành công" });
});

// Sửa user (chỉ sửa full_name, role)
router.put("/:id", auth, adminOnly, async (req, res) => {
  const { full_name, role } = req.body;
  await User.update(
    { full_name, role },
    { where: { id: req.params.id } }
  );
  res.json({ message: "Cập nhật thành công" });
});

// Đổi password user khác
router.put("/:id/password", auth, adminOnly, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: "Thiếu mật khẩu mới" });
  await User.update(
    { password_hash: bcrypt.hashSync(newPassword, 10) },
    { where: { id: req.params.id } }
  );
  res.json({ message: "Đổi mật khẩu thành công" });
});

// Xoá user
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xoá user" });
});

module.exports = router;
