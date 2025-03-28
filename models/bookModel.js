const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:{type:String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  genre: {type:String},
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;

