const Book = require('../models/bookModel');
const Author = require('../models/authorModel')


const createBook = async (req, res) => {
 try {
   const { title, author} = req.body;
   const newBook = new Book({ title, author });
   await newBook.save();
   res.status(201).json(newBook);
 } catch (error) {
   res.status(400).json({ message: error.message });
 }
};


const getAllBooks = async (req, res) => {
 try {
   const books = await Book.find();
   res.json(books);
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};


const getBookById = async (req, res) => {
 try {
   const book = await Book.findById(req.params.id);
   if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
   res.json(book);
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};


const updateBook = async (req, res) => {
 try {
   const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
   if (!updatedBook) return res.status(404).json({ message: 'Livre non trouvé' });
   res.json(updatedBook);
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};


const deleteBook = async (req, res) => {
 try {
   const deletedBook = await Book.findByIdAndDelete(req.params.id);
   if (!deletedBook) return res.status(404).json({ message: 'Livre non trouvé' });
   res.json({ message: 'Livre supprimé avec succès' });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};
module.exports ={createBook,deleBook,updateBook,getBookById ,getAllBooks};
