

const express = require('express');
const { createAuthor, getAuthors, updateAuthor, deleteAuthor } = require('../controllers/authorController');
const router = express.Router();

// Ajouter un auteur
router.post('/', createAuthor);

// Obtenir tous les auteurs
router.get('/', getAuthors);

// Modifier un auteur
router.put('/:authorId', updateAuthor);

// Supprimer un auteur
router.delete('/:id', deleteAuthor);

module.exports = router;


