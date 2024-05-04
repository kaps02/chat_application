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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
   
}, 
{
    freezeTableName: true // Set freezeTableName option to true
}
);

// Export the Chat model
module.exports = Chat;
