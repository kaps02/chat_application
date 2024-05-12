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
    imageUrl: {
        type: DataTypes.STRING, // Field to store the URL of the uploaded image
        allowNull: true // Allow null to accommodate text messages
    },
    isImage: {
        type: DataTypes.BOOLEAN, // Boolean flag to differentiate between text and image messages
        allowNull: false,
        defaultValue: false // Default value is false (text message)
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
