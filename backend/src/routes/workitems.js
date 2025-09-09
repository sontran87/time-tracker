// src/routes/workitems.js
const express = require("express");
const router = express.Router();
const WorkItem = require("../models/workitem");
const { auth, adminOnly } = require("../middleware/auth");

// Lấy danh sách hạng mục
router.get("/", auth, async (req, res) => {
  const data = await WorkItem.findAll();
  res.json(data);
});

// Thêm mới
router.post("/", auth, adminOnly, async (req, res) => {
  const { name } = req.body;
  await WorkItem.create({ name });
  res.json({ message: "Đã thêm hạng mục" });
});

// Sửa
router.put("/:id", auth, adminOnly, async (req, res) => {
  const { name } = req.body;
  await WorkItem.update({ name }, { where: { id: req.params.id } });
  res.json({ message: "Đã cập nhật hạng mục" });
});

// Xoá
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await WorkItem.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xoá hạng mục" });
});

module.exports = router;
