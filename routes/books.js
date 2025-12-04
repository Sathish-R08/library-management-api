const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { createBook, getAllBooks, checkoutBook } = require('../controllers/bookController');

const bookValidation = [
  body('title').trim().notEmpty(),
  body('author').trim().notEmpty(),
  body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('genre').optional().trim(),
  body('stock').notEmpty().isInt({ min: 0 }),
];

router.post('/', protect, bookValidation, createBook);
router.get('/', getAllBooks);
router.post('/:id/checkout', protect, checkoutBook);

module.exports = router;