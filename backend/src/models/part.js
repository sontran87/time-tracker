const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize_instance");

const Part = sequelize.define("Part", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

module.exports = Part;
