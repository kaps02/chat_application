// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.post('/signup', user.createUser);
router.post('/login', user.postLogin);
router.get('/login', user.getLogin);
router.get('/', user.getUser);

module.exports = router;
