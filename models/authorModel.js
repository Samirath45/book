

const mongoose = require('mongoose');

const authorSchema =  new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
});

const Author = mongoose.model('Author', authorSchema,'authors');
module.exports = Author;
