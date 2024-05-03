// controllers/userController.js
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Group = require('../models/groupModel');
const GroupMember = require('../models/groupmemberModel');
const jwt = require('jsonwebtoken');
//const sequelize = require('sequelize');

// Function to generate JWT token
exports.generateToken = (id, name) => {
    const payload = { id: id, name: name };
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
        const token = exports.generateToken(user.id, user.name);
        console.log("Login successful", token);
        res.status(200).json({ success: true, message: "User logged in successfully", token });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getchat = async (req, res) => {
    res.sendFile('chat.html', { root: './view' });
}


exports.createChat = async (req, res) => {
    // Create new user
    const group = await Group.findOne({ where: { groupName: req.body.groupName } });

    console.log("...............................", group.dataValues.groupID);

    await Chat.create({ message: req.body.message, UserId: req.user.id, GroupId: group.dataValues.groupID });
    console.log("chat created successfully");
    res.status(200).json({ success: true, message: 'chat created successfully' });

}


exports.readChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const GroupName = req.params.groupId;

        const group = await Group.findOne({ where: { groupName: GroupName } }) || 1;
        //console.log("GroupId......", group);


        // Read chat messages from the database for the logged-in user where the user is the sender
        const messages = await Chat.findAll({
            where: {
                GroupId: group.groupID
            },
            include: [{ model: User, attributes: ['name'] }], // Include User model to fetch sender's name
            attributes: ['message', 'groupID'] // Select only the 'message'  and groupId attribute from Chat model
        });
        const len = messages.length;
        // Extract message content and sender's name from the messages array
        const chatMessages = messages.map(message => ({
            senderName: message.User.name,
            message: message.message,
            len: len
        }));

       // console.log("Chat read successfully", chatMessages);
        res.status(200).json({ success: true, messages: chatMessages });
    } catch (error) {
        console.error("Error reading chat:", error);
        res.status(500).json({ success: false, message: 'Failed to read chat' });
    }
}

exports.createGroup = async (req, res) => {
    const { groupName, userId } = req.body;
    if (!groupName || !userId || userId.length === 0) {
        return res.status(400).json({ error: 'Invalid request. groupName and userId are required.' });
    }

    try {
        // Create the group
        const group = await Group.create({ groupName });
        console.log("Group created:", group);

        // Add users to the group
        if (userId && userId.length > 0) {
            const users = await User.findAll({ where: { id: userId } });
            //await group.addUsers(users);
            console.log("Users exist in group:", users);
        }

        // Create entry in GroupMember table
        await GroupMember.create({ userId, admin: 1, groupId: group.groupID });
        console.log("Entry created in GroupMember table");



        res.status(201).json(group);
    } catch (error) {
        console.error('Error creating group:', error);

        res.status(500).json({ error: 'Internal Server Error in creating group' });
    }

};

exports.joinGroup = async (req, res) => {
    try {
        console.log(req.body);
        const { groupName, userName } = req.body;

        // Fetch the user and group instances (replace with your actual logic to fetch these)
        const user = await User.findOne({ where: { name: userName } });
        const group = await Group.findOne({ where: { groupName: groupName } });
        //console.log(user, group)

        if (!user || !group) {
            console.error("User or group not found.");
            return res.status(404).json({ error: "User or group not found" }); // Handle error appropriately
        }
        console.log("-------", user.id, group.dataValues.groupID)

        // Associate the user with the group by creating a new GroupMember record
        try {
            const joinGroup = await GroupMember.create({
                userId: user.id,
                admin: 0,
                groupId: group.dataValues.groupID
            });
            //console.log("User joined group successfully:", joinGroup);
            return res.status(200).json({ message: "User joined group successfully" });
        } catch (error) {
            console.error("Error joining user to group:", error);
            return res.status(500).json({ error: "Error joining user to group" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error in join group" });
    }
};

// Get a list of groups the user is a member of
exports.getGroup = async (req, res) => {
    try {
        console.log("we r in groupget.......")
        const userId = req.params.userId;

        // Find the user
        const user = await User.findByPk(userId, { include: Group });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const groups = user.Groups.map(group => ({
            id: group.id,
            groupName: group.groupName,
        }));
        console.log("user....in..getgroup..");
        if (groups.length <= 0) {
            return res.status(200).json({ message: "no groups yet" });
        }
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error getting user groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.groupMember = async (req, res) => {
    const { groupName } = req.params;

    console.log(req.params);

    try {
        // Find the group by its name
        const group = await Group.findOne({
            where: { groupName: groupName }
        });

        // Check if the group exists
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        //console.log(group)

        const groupMembers = await GroupMember.findAll({
            where: { groupId: group.groupID }

        });
        //console.log(groupMembers)
        // Extract user names from groupMembers
        // Map each group member to fetch their user names
        const userPromises = groupMembers.map(async (member) => {
            const user = await User.findOne({
                where: { id: member.userId },
                attributes: ['name']
            });
            return user ? user.name : null;
        });

        // Wait for all user names to be resolved
        const userNames = await Promise.all(userPromises);

        // Return the list of user names
        res.json(userNames);

    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


exports.makeAdmin = async (req, res) => {
    console.log(req.params);
    const { groupName, userName } = req.params;

    try {
        // Find the group by its name
        const group = await Group.findOne({
            where: { groupName: groupName }
        });

        // Check if the group exists
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Find the user by their name
        const user = await User.findOne({
            where: { name: userName }
        });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(user.id, group.groupID)
        // Find the GroupMember entry for the user in the group
        const groupMember = await GroupMember.findOne({
            where: { userId: user.id, groupId: group.groupID }
        });

        // Check if the user is a member of the group
        if (!groupMember) {
            return res.status(404).json({ error: 'User is not a member of the group' });
        }

        // Update the isAdmin status to 1
        await groupMember.update({ admin: 1 });

        return res.status(200).json({ message: 'Admin status updated successfully' });

    } catch (error) {
        console.error('Error updating admin status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.deleteMember = async (req, res) => {
    console.log(req.params);
    const { groupName, userName } = req.params;
    const admincheck = req.body.adminCheck;

    console.log(admincheck)

    // Find the group by its name
    const group = await Group.findOne({
        where: { groupName: groupName }
    });

    // Check if the group exists
    if (!group) {
        return res.status(404).json({ error: 'Group not found' });
    }

    // Find the user by their name
    const user = await User.findOne({
        where: { name: userName }
    });

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        console.log("admin mode...",admincheck,user.id  , group.groupID )
        // Check if the user is an admin of the group
        const isAdmin = await GroupMember.findOne({
            where: { userId: admincheck, groupId: group.groupID, admin: 1 }
        });
    
        // If the user is an admin, delete the GroupMember entry
        if (isAdmin) {
            console.log("deleting mmbr...",admincheck , group.groupID )
            const deletedCount = await GroupMember.destroy({
                where: { userId: user.id, groupId: group.groupID }
            });
    
            if (deletedCount > 0) {
                return res.status(200).json({ message: `${userName} removed  successfully` });
            } else {
                return res.status(404).json({ error: 'No member found to remove' });
            }
        } else {
            return res.status(403).json({ error: 'You are not authorized to remove members' });
        }
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    
}

