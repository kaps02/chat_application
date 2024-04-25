const express = require('express');
const path = require('path');
const userRoute = require('./route/userRoute');
//const chatRoute = require('./route/chatRoute');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const cors = require('cors');
const Chat = require('./models/chatModel');
const User = require('./models/userModel');
const Group = require('./models/groupModel');
const GroupMember = require('./models/groupmemberModel');
require('dotenv').config();



const app = express(); // Declare 'app' as a variable

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));

app.use(cors({origin: '*'}))
app.use('/user', userRoute);

// Define the relationship
User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat, { foreignKey: 'GroupId' });
Chat.belongsTo(Group, { foreignKey: 'GroupId' });


User.belongsToMany(Group, { through: GroupMember,foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember,foreignKey: 'groupId' });


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
