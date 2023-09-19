const express = require('express');
const { validateUser } = require('../models/User');
const validateMiddleware = require('../middlewares/validate');
const userCtrl = require('../controllers/user');
const router = express.Router();

router.post('/signup', validateMiddleware(validateUser), userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
