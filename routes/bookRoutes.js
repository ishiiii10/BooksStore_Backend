const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

router.use(protect); // Protect all routes

router.route('/')
    .post(createBook)
    .get(getAllBooks);

router.route('/:id')
    .get(getBookById)
    .put(updateBook)
    .delete(deleteBook);

module.exports = router;