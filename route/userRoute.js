// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const chat = require('../controllers/userController');
const group = require('../controllers/userController');
const Authentication = require('../middleware/auth')


router.get('/api/chat/:groupId' , Authentication.authenticate , chat.readChat);
router.post('/message' , Authentication.authenticate , chat.createChat);
router.post('/message-image' , Authentication.authenticate , chat.sendImage);


router.post('/create-group',Authentication.authenticate,  group.createGroup);
router.get('/get-group/:userId' ,Authentication.authenticate , group.getGroup);
router.post('/join-group',Authentication.authenticate   , group.joinGroup);

router.get('/group-members/:groupName' ,Authentication.authenticate , group.groupMember);
router.post('/group-members/:groupName/:userName' ,Authentication.authenticate , group.makeAdmin);
router.delete('/group-members/:groupName/:userName' ,Authentication.authenticate , group.deleteMember);


router.post('/signup', user.createUser);
router.post('/login' , user.postLogin);
router.get('/login', user.getLogin);
router.get('/chat' , user.getchat);
router.get('/', user.getUser);



module.exports = router;
