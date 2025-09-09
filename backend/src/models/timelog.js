const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize_instance");

const TimeLog = sequelize.define("TimeLog", {
  date: { type: DataTypes.STRING, allowNull: false },
  hour: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  notes: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

module.exports = TimeLog;
