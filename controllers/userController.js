// controllers/userController.js
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); 
const Chat = require('../models/chatModel'); 
const jwt = require('jsonwebtoken');

// Function to generate JWT token
exports.generateToken = (id) => {
    const payload = { id: id };
    const secretKey = 'secretkey';
    return jwt.sign(payload, secretKey); // Signing the token with the payload and secret key
};

exports.getUser = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'signup.html'));
};


// Controller for user signup
exports.createUser = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        console.log(name, email, phone, password);
        // Check if user with the given email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log("User already exists in the database");
            res.status(400).json({ success: false, message: 'User already exists' });
        }
        else {

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            await User.create({ name, email, phone, password: hashedPassword });
            console.log("User created successfully");
            res.status(200).json({ success: true, message: 'User created successfully' });
        }

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error in controller....' });
    }
}

exports.getLogin = (req, res) => {
    res.sendFile('login.html', { root: './view' });
}

// Controller for user login
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User does not exist');
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log('Incorrect password');
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

        // Generate token and send it in response
        const token = exports.generateToken(user.id);
        console.log("Login successful", token);
        res.status(200).json({ success: true, message: "User logged in successfully", token });
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getchat = async(req , res)=>{
    res.sendFile('chat.html', { root: './view' });
}


exports.createChat = async (req, res) => {
    // Create new user
    console.log("...............................",req.user.id);
    await Chat.create({ message:req.body.message, senderId:req.user.id, receiverId:2 ,UserId :req.user.id });
    console.log("chat created successfully");
    res.status(200).json({ success: true, message: 'chat created successfully' });
   
   }


   exports.readChat = async (req, res) => {
    try {
        const userId = req.user.id;
 
        // Read chat messages from the database for the logged-in user where the user is the sender
        const messages = await Chat.findAll({
            where: {
                senderId: userId
            },
            attributes: ['message'] // Select only the 'message' attribute
        });
 
        // Extract message content from the messages array
        const chatMessages = messages.map(message => message.message);
 
        console.log("Chat read successfully", chatMessages);
        res.status(200).json({ success: true, messages: chatMessages });
    } catch (error) {
        console.error("Error reading chat:", error);
        res.status(500).json({ success: false, message: 'Failed to read chat' });
    }
 }
 
   