const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    publishedDate: {
        type: Date,
        required: [true, 'Published date is required']
    }
}, {
    timestamps: true
});

// Add index for text search on title
bookSchema.index({ title: 'text' });

module.exports = mongoose.model('Book', bookSchema);