const sequelize = require("./sequelize_instance");
const User = require("./user");
const Product = require("./product");
const WorkItem = require("./workitem");
const Part = require("./part");
const ProductPart = require("./productPart");
const TimeLog = require("./timelog");
const bcrypt = require("bcryptjs");

// Thiết lập quan hệ
ProductPart.belongsTo(Product, { foreignKey: "productID" });
ProductPart.belongsTo(Part, { foreignKey: "partId" });

TimeLog.belongsTo(User, { foreignKey: "UserId" });
TimeLog.belongsTo(Product, { foreignKey: "ProductId" });
TimeLog.belongsTo(WorkItem, { foreignKey: "WorkItemId" });
TimeLog.belongsTo(Part, { foreignKey: "PartId" }); // Nếu muốn

// Hàm sync và tạo admin
async function syncAndSeed() {
  await sequelize.sync();
  const admin = await User.findOne({ where: { username: "admin" } });
  if (!admin) {
    await User.create({
      username: "admin",
      password_hash: bcrypt.hashSync("123456", 10),
      full_name: "Quản trị viên",
      role: "admin",
    });
    console.log("[DB] Đã tạo user admin/123456 mặc định!");
  }
}

module.exports = {
  sequelize,
  User,
  Product,
  WorkItem,
  Part,
  ProductPart,
  TimeLog,
  syncAndSeed,
};
