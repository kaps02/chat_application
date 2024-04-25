// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const chat = require('../controllers/userController');
const group = require('../controllers/userController');
const Authentication = require('../middleware/auth')


router.get('/api/chat/:groupId' , Authentication.authenticate , chat.readChat);
router.post('/message' , Authentication.authenticate , chat.createChat);

router.post('/create-group',Authentication.authenticate,  group.createGroup);
router.get('/get-group/:userId' ,Authentication.authenticate , group.getGroup);
router.post('/join-group',Authentication.authenticate   , group.joinGroup);

router.post('/signup', user.createUser);
router.post('/login' , user.postLogin);
router.get('/login', user.getLogin);
router.get('/chat' , user.getchat);
router.get('/', user.getUser);



module.exports = router;
