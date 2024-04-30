const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel'); // Import the User model if not already imported
const Group = require('./groupModel'); // Import the Group model if not already imported

const GroupMember = sequelize.define('GroupMember', {
  groupMemberID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin : {
    type: DataTypes.BOOLEAN

  }
  
});

module.exports = GroupMember;
