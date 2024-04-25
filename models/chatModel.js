const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Chat model
const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
}, {
    freezeTableName: true // Set freezeTableName option to true
},
{
    timestamps: false // Disable timestamps (createdAt and updatedAt columns)
});

// Export the Chat model
module.exports = Chat;
