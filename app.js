const express = require('express');
const path = require('path');
const userRoute = require('./route/userRoute');
//const chatRoute = require('./route/chatRoute');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const cors = require('cors');
const Chat = require('./models/chatModel');
const User = require('./models/userModel');
require('dotenv').config();



const app = express(); // Declare 'app' as a variable

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));

app.use(cors({origin: '*'}))
app.use('/user', userRoute);

// Define the relationship
User.hasMany(Chat);
Chat.belongsTo(User);

//Sync database
sequelize.sync({force : false})
.then(() => {
    console.log('DB synced');
})
.catch(err => {
    console.error('Error syncing  database: ', err);
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}..........`);
});
