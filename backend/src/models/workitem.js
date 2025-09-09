const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize_instance");

const WorkItem = sequelize.define("WorkItem", {
  name: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

module.exports = WorkItem;
