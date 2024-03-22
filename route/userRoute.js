// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.post('/signup', user.createUser);
router.get('/', user.getUser);

module.exports = router;
