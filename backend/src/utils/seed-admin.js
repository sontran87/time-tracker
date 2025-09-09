// Tạo user admin mặc định nếu chưa có
const sequelize = require("../models/index");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  await sequelize.sync();
  const admin = await User.findOne({ where: { username: "admin" } });
  if (!admin) {
    await User.create({
      username: "admin",
      password_hash: bcrypt.hashSync("123456", 10),
      full_name: "Admin",
      role: "admin"
    });
    console.log("✅ Đã tạo user admin mặc định: admin / 123456");
  } else {
    console.log("User admin đã tồn tại.");
  }
  process.exit(0);
}

seedAdmin();
