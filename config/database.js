const { Sequelize } = require('sequelize');
require('dotenv').config();


// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize({
    dialect: process.env.DATABASE_DIALECT, // Or any other dialect such as 'postgres', 'sqlite' etc.
    host: process.env.DATABASE_HOST,
    username: process.env.USER_NAME,
    password: process.env.USER_PASSWORD,
    database: process.env.DATABASE_NAME, //env variable name
});

module.exports = sequelize;
