const express = require('express');
const path = require('path');
const userRoute = require('./route/userRoute');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const cors = require('cors');
require('dotenv').config();



const app = express(); // Declare 'app' as a variable

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));

app.use(cors({origin: '*'}))
app.use('/user', userRoute);

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
    console.log(`Server running on port ${port}`);
});
