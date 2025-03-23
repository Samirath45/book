const express = require('express');
const { createBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');
const router = express.Router();

// Créer un livre
router.post('/', createBook);

// Obtenir tous les livres
router.get('/', getBooks);

// Modifier un livre
router.put('/:bookId', updateBook);

// Supprimer un livre
router.delete('/:bookId', deleteBook);

module.exports = router;
