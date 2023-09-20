const express = require('express');
const { validateUser } = require('../models/User');
const validateMiddleware = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimit');
const userCtrl = require('../controllers/user');
const router = express.Router();

router.post(
  '/signup',
  authLimiter,
  validateMiddleware(validateUser),
  userCtrl.signup
);
router.post('/login', authLimiter, userCtrl.login);

module.exports = router;
