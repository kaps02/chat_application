// Define Group model
const {  DataTypes } = require('sequelize');
const sequelize = require('../config/database')


const Group = sequelize.define('Group', {
    groupID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique:false,
      autoIncrement: true
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
      timestamps: false // Disable timestamps (createdAt and updatedAt columns)
  });

  module.exports = Group;