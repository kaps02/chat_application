// models/UserModel.js
const {  DataTypes } = require('sequelize');
const sequelize = require('../config/database')

// Define the User model
const User = sequelize.define('User', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        phone: {
          type: DataTypes.STRING, 
          allowNull: false
        },
        password: {
            type: DataTypes.STRING, 
            allowNull: false
          },
      
      }, {
        freezeTableName: true // Set freezeTableName option to true
    });
      


// Export the Expense model
module.exports = User;
