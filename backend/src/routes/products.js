// src/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { auth, adminOnly } = require("../middleware/auth");

// Lấy danh sách sản phẩm
router.get("/", auth, async (req, res) => {
  const data = await Product.findAll();
  res.json(data);
});

// Thêm sản phẩm (admin)
router.post("/", auth, adminOnly, async (req, res) => {
  const { productId, code, name, active } = req.body;
  await Product.create({ productId, code, name, active });
  res.json({ message: "Đã thêm sản phẩm" });
});

// Sửa sản phẩm
router.put("/:id", auth, adminOnly, async (req, res) => {
  const { code, name, active } = req.body;
  await Product.update({ code, name, active }, { where: { id: req.params.id } });
  res.json({ message: "Đã cập nhật sản phẩm" });
});

// Xoá sản phẩm
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xoá sản phẩm" });
});

module.exports = router;
