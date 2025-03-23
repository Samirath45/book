const Author = require('../models/authorModel');

// Ajouter un auteur
const createAuthor = async (req, res) => {
  const {name,bio} = req.body;
  try {
    const newAuthor = new Author({ name,bio});
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les auteurs
const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un auteur
const updateAuthor = async (req, res) => {
  const { authorId } = req.params;
  const { name, bio } = req.body;

  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author ps trouver' });

    author.name = name || author.name;
    author.bio = bio || author.bio;

    await author.save();
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un auteur


const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres
    console.log("ID reçu : ", id);
    const author = await Author.findByIdAndDelete(id); // Suppression par ID
    if (!author) {
      return res.status(404).json({ message: 'Auteur non trouvé' });
    }
    res.status(200).json({ message: 'Auteur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createAuthor, getAuthors, updateAuthor, deleteAuthor };


