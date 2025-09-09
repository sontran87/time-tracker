const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize_instance");

const Product = sequelize.define("Product", {
  productId: { type: DataTypes.STRING, unique: true, allowNull: false },
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  timestamps: true,
});

module.exports = Product;
