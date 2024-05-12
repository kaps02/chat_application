const express = require('express');
const path = require('path');
const userRoute = require('./route/userRoute');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const cors = require('cors');
const Chat = require('./models/chatModel');
const User = require('./models/userModel');
const Group = require('./models/groupModel');
const GroupMember = require('./models/groupmemberModel');
const {startArchiveJob} = require('./sevices/archiveMessages');


startArchiveJob();

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));
app.use(cors({ origin: '*' }));
app.use('/user', userRoute);

// Define the relationship
User.hasMany(Chat , { foreignKey: 'groupId' });
Chat.belongsTo(User,{ foreignKey: 'userId' });

Group.hasMany(Chat, { foreignKey: 'groupId' });
Chat.belongsTo(Group, { foreignKey: 'groupId' });

User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId' });

//Sync database
sequelize.sync({ force: false })
    .then(() => {
        console.log('DB synced');
    })
    .catch(err => {
        console.error('Error syncing database: ', err);
    });

// Create WebSocket server
const server = require('http').createServer(app);
const io = socketIo(server);

const users = {}

io.on('connection', socket => {
    console.log('New connection:', socket.id); // Log new socket connection

    socket.on('new-user', name => {
        console.log('New user:', name);
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    });

    socket.on('send-chat-message', message => {
        console.log('Chat message:', message);
        io.emit('chat-message', { message: message, name: users[socket.id] });
        //io.emit('chat-message', { message, name: senderName });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', users[socket.id]);
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

//io.emit('new-message', { text: 'Hello, world!' });

const port = process.env.PORT || 8000;
server.listen(port, () => {     //server.listen
    console.log(`Server running on port ${port}`);
});
