// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const chat = require('../controllers/userController');
const Authentication = require('../middleware/auth')

router.post('/signup', user.createUser);
router.post('/login' , user.postLogin);
router.get('/login', user.getLogin);
router.get('/chat' , user.getchat);
router.get('/', user.getUser);
router.get('/api/chat' , Authentication.authenticate , chat.readChat);

router.post('/message' , Authentication.authenticate , chat.createChat);


module.exports = router;
