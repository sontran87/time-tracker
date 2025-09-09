const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize_instance");

const ProductPart = sequelize.define("ProductPart", {
  productID: { type: DataTypes.INTEGER, allowNull: false },
  partId: { type: DataTypes.INTEGER, allowNull: false },
  partName: { type: DataTypes.STRING },
  weight: { type: DataTypes.FLOAT, defaultValue: 0 },
  description: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

module.exports = ProductPart;
