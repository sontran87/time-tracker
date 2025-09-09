// src/routes/productParts.js
const express = require("express");
const router = express.Router();
const ProductPart = require("../models/productPart");
const { auth, adminOnly } = require("../middleware/auth");

// Lấy danh sách product-part
router.get("/", auth, async (req, res) => {
  const data = await ProductPart.findAll();
  res.json(data);
});

// Thêm mới product-part
router.post("/", auth, adminOnly, async (req, res) => {
  const { productID, partId, partName, weight, description } = req.body;
  await ProductPart.create({ productID, partId, partName, weight, description });
  res.json({ message: "Đã thêm product-part" });
});

// Sửa
router.put("/:id", auth, adminOnly, async (req, res) => {
  const { productID, partId, partName, weight, description } = req.body;
  await ProductPart.update({ productID, partId, partName, weight, description }, { where: { id: req.params.id } });
  res.json({ message: "Đã cập nhật" });
});

// Xoá
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await ProductPart.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xoá" });
});

module.exports = router;
