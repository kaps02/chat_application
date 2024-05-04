const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the ArchivedChat model
const ArchivedChat = sequelize.define('ArchivedChat', {
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
    timestamps: true // Disable timestamps (createdAt and updatedAt columns)
});

// Export the ArchivedChat model
module.exports = ArchivedChat;
