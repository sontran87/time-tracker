// src/routes/timelogs.js
const express = require("express");
const router = express.Router();
const TimeLog = require("../models/timelog");
const User = require("../models/user");
const Product = require("../models/product");
const WorkItem = require("../models/workitem");
const Part = require("../models/part");
const { auth, adminOnly } = require("../middleware/auth");
const { Op } = require("sequelize");

// Lấy danh sách chấm công của user đang login (hoặc tất cả nếu là admin)
router.get("/", auth, async (req, res) => {
  const { date, from, to } = req.query;
  let where = {};
  // Nếu không phải admin thì chỉ lấy log của user
  if (req.user.role !== "admin") where.UserId = req.user.id;
  if (date) where.date = date;
  if (from && to) where.date = { [Op.between]: [from, to] };

  const logs = await TimeLog.findAll({
    where,
    order: [["date", "DESC"], ["createdAt", "DESC"]],
    include: [
      { model: Product, attributes: ["code", "name", "productId"] },
      { model: WorkItem, attributes: ["name"] },
      { model: Part, attributes: ["name", "description"] }
    ]
  });

  res.json(logs.map(log => ({
    id: log.id,
    date: log.date,
    hour: log.hour,
    quantity: log.quantity,
    notes: log.notes,
    product_code: log.Product?.code,
    product_name: log.Product?.name,
    product_id: log.Product?.productId,
    workitem_name: log.WorkItem?.name,
    part_name: log.Part?.name,
    part_description: log.Part?.description,
    user_full_name: req.user.role === "admin" ? (log.User?.full_name || "") : undefined
  })));
});

// Thêm mới chấm công
router.post("/", auth, async (req, res) => {
  const { date, hour, notes, ProductId, WorkItemId, quantity, partId } = req.body;
  await TimeLog.create({
    date, hour, notes, quantity,
    UserId: req.user.id,
    ProductId, WorkItemId, partId
  });
  res.json({ message: "Đã ghi nhận chấm công" });
});

// Sửa chấm công (chỉ chủ nhân hoặc admin)
router.put("/:id", auth, async (req, res) => {
  const log = await TimeLog.findByPk(req.params.id);
  if (!log) return res.status(404).json({ message: "Không tìm thấy" });
  if (req.user.role !== "admin" && log.UserId !== req.user.id) {
    return res.status(403).json({ message: "Không có quyền" });
  }
  const { date, hour, notes, ProductId, WorkItemId, quantity, partId } = req.body;
  await log.update({ date, hour, notes, ProductId, WorkItemId, quantity, partId });
  res.json({ message: "Đã cập nhật" });
});

// Xoá (chỉ chủ nhân hoặc admin)
router.delete("/:id", auth, async (req, res) => {
  const log = await TimeLog.findByPk(req.params.id);
  if (!log) return res.status(404).json({ message: "Không tìm thấy" });
  if (req.user.role !== "admin" && log.UserId !== req.user.id) {
    return res.status(403).json({ message: "Không có quyền" });
  }
  await log.destroy();
  res.json({ message: "Đã xoá" });
});

module.exports = router;
