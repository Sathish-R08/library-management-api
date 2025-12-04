const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

const loginValidation = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;