// src/routes/parts.js
const express = require("express");
const router = express.Router();
const Part = require("../models/part");
const { auth, adminOnly } = require("../middleware/auth");

// Lấy danh sách linh kiện
router.get("/", auth, async (req, res) => {
  const data = await Part.findAll();
  res.json(data);
});

// Thêm linh kiện
router.post("/", auth, adminOnly, async (req, res) => {
  const { name, description } = req.body;
  await Part.create({ name, description });
  res.json({ message: "Đã thêm linh kiện" });
});

// Sửa linh kiện
router.put("/:id", auth, adminOnly, async (req, res) => {
  const { name, description } = req.body;
  await Part.update({ name, description }, { where: { id: req.params.id } });
  res.json({ message: "Đã cập nhật linh kiện" });
});

// Xoá linh kiện
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Part.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xoá linh kiện" });
});

module.exports = router;
