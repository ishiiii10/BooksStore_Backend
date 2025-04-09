const Book = require('../models/bookModel');

// Create new book
const createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json({
            status: 'success',
            data: book
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get all books with filtering, search, and pagination
const getAllBooks = async (req, res) => {
    try {
        let query = Book.find();

        // Filtering
        if (req.query.author) {
            query = query.where('author').equals(req.query.author);
        }
        if (req.query.category) {
            query = query.where('category').equals(req.query.category);
        }
        if (req.query.rating) {
            query = query.where('rating').gte(req.query.rating);
        }

        // Search by title
        if (req.query.title) {
            query = query.find({ $text: { $search: req.query.title } });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const books = await query;

        res.status(200).json({
            status: 'success',
            results: books.length,
            data: books
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get book by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                status: 'fail',
                message: 'Book not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: book
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update book
const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            return res.status(404).json({
                status: 'fail',
                message: 'Book not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: book
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Delete book
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({
                status: 'fail',
                message: 'Book not found'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
};