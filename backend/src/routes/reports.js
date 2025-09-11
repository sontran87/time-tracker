// src/routes/reports.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { auth, adminOnly } = require("../middleware/auth");
const TimeLog = require("../models/timelog");
const User = require("../models/user");
const Product = require("../models/product");
const WorkItem = require("../models/workitem");

// GET /api/reports?type=product|user|workitem&month=YYYY-MM&userId
router.get("/", auth, async (req, res) => {
  try {
    const { type = "product", month, userId } = req.query;
    let where = {};

    // Lọc theo tháng
    if (month) {
      where.date = {
        [Op.gte]: `${month}-01`,
        [Op.lt]: `${month}-32`
      };
    }

    // Nếu không phải admin chỉ cho xem dữ liệu của chính mình
    if (req.user.role !== "admin") {
      where.UserId = req.user.id;
    } else if (userId) {
      where.UserId = userId;
    }

    // Query group by type
    let groupByField = "ProductId";
    let include = [];
    let labelFn = (row) => row.Product?.code || "";

    if (type === "user") {
      groupByField = "UserId";
      include.push({ model: User, attributes: ["full_name"] });
      labelFn = (row) => row.User?.full_name || "";
    }
    if (type === "workitem") {
      groupByField = "WorkItemId";
      include.push({ model: WorkItem, attributes: ["name"] });
      labelFn = (row) => row.WorkItem?.name || "";
    }
    if (type === "product") {
      include.push({ model: Product, attributes: ["code"] });
    }

    // Query và group by
    const results = await TimeLog.findAll({
      where,
      include,
      attributes: [
        groupByField,
        [TimeLog.sequelize.fn("SUM", TimeLog.sequelize.col("hour")), "total_hour"]
      ],
      group: [groupByField],
      raw: false,
    });

    // Kết quả về dạng [{ key, total_hour }]
    const data = results.map((row) => ({
      key: labelFn(row),
      total_hour: parseFloat(row.get("total_hour")) || 0
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi báo cáo" });
  }
});

module.exports = router;
