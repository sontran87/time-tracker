const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize_instance");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false }, // admin hoặc user
}, {
  timestamps: true,
});

module.exports = User;
