const Book = require('../models/Book');
const { validationResult } = require('express-validator');

exports.createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const book = await Book.create(req.body);

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const { genre, author, minYear, available, limit = 10, offset = 0 } = req.query;

    const filter = {};
    if (genre) filter.genre = new RegExp(genre, 'i');
    if (author) filter.author = new RegExp(author, 'i');
    if (minYear) filter.publishedYear = { $gte: parseInt(minYear) };
    if (available === 'true') filter.stock = { $gt: 0 };

    const books = await Book.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkoutBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    if (book.stock <= 0) {
      return res.status(400).json({ success: false, error: 'Book out of stock' });
    }

    book.stock -= 1;
    await book.save();

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};