// controllers/userController.js
const path = require('path');
const bcrypt = require('bcrypt');
const  User  = require('../models/userModel'); // Assuming User is exported from database.js


exports.getUser = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'signup.html'));
};


// Controller for user signup
exports.createUser = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try { console.log(name, email, phone, password);
        // Check if user with the given email already exists
         const existingUser = await User.findOne({ where: { email } });
         if (existingUser) {
             console.log("User already exists in the database");
               res.status(400).json({ success: false, message: 'User already exists' });
         }
         else{
            
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
