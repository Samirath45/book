BOOK-API
Avant de commencer à développer l'application, il est nécessaire de préparer l'environnement de travail en installant les outils essentiels.
Installation de Node.js : Node.js est indispensable pour faire fonctionner le serveur Express. Il permet de gérer les requêtes HTTP et d'exécuter du JavaScript côté serveur. Pour l'installer, il suffit de télécharger la version stable sur le site officiel de Node.js.


Installation d'Express : Express est un framework pour Node.js qui facilite la gestion des routes et des middlewares. Il est installé en exécutant la commande npm install express dans le terminal, à l'intérieur du répertoire du projet.


Installation de Mongoose : Mongoose est une bibliothèque qui permet de manipuler MongoDB avec Node.js. Il simplifie les opérations comme la création de modèles et la gestion des requêtes. Pour l'installer, il faut exécuter npm install mongoose.


Installation de JSON Web Token (jsonwebtoken) : jsonwebtoken permet de créer des tokens pour l'authentification et la gestion de sessions utilisateurs de manière sécurisée. Il est essentiel pour protéger certaines routes en vérifiant que l'utilisateur est bien authentifié. Pour l'installer, il faut exécuter npm install jsonwebtoken.


Installation de bcrypt : bcrypt est une bibliothèque qui sert à hacher les mots de passe pour les sécuriser avant de les enregistrer dans la base de données. Cela empêche quiconque d'avoir accès aux mots de passe en clair. Pour l'installer, il faut exécuter npm install bcrypt.


Installation des autres dépendances : En plus des bibliothèques principales, il peut être nécessaire d'installer d'autres dépendances comme dotenv pour gérer les variables d'environnement (par exemple, la chaîne de connexion MongoDB) et cors pour autoriser les requêtes venant d'autres domaines. Les commandes pour installer ces dépendances sont npm install dotenv et npm install cors.

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
 try {
   await mongoose.connect(process.env.MONGO_URI, {dbName: 'book'
        });
   console.log('MongoDB connecté');
 } catch (error) {
   console.error(error);
   process.exit(1);
 }
};

module.exports = { connectDB };

2. Contrôleurs (Controllers)
Les contrôleurs gèrent les requêtes HTTP pour interagir avec les modèles de données. Voici des exemples de contrôleurs pour les auteurs, les livres, et l'authentification des utilisateurs.
a) Contrôleur des auteurs (authorController.js)
Gère la création, la modification, l'obtention et la suppression d'un auteur.
javascript
CopierModifier
const Author = require('../models/authorModel');

// Ajouter un auteur
const createAuthor = async (req, res) => {
 const { name, bio } = req.body;
 try {
   const newAuthor = new Author({ name, bio });
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
   if (!author) return res.status(404).json({ message: 'Auteur non trouvé' });
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
   const { id } = req.params;
   const author = await Author.findByIdAndDelete(id);
   if (!author) return res.status(404).json({ message: 'Auteur non trouvé' });
   res.status(200).json({ message: 'Auteur supprimé' });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

module.exports = { createAuthor, getAuthors, updateAuthor, deleteAuthor };

b) Contrôleur des livres (bookController.js)
Gestion des livres : création, mise à jour, suppression et obtention des livres.
javascript
CopierModifier
const Book = require('../models/bookModel');
const Author = require('../models/authorModel');

const createBook = async (req, res) => {
 try {
   const { title, author } = req.body;
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

const getBook = async (req, res) => {
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
   res.json({ message: 'Livre supprimé' });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

module.exports = { createBook, deleteBook, updateBook, getBook, getAllBooks };

c) Contrôleur des utilisateurs (userController.js)
Gère l'enregistrement et la connexion des utilisateurs avec JWT.
javascript
CopierModifier
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
 const { name, email, password } = req.body;
 try {
   const userExists = await User.findOne({ email });
   if (userExists) {
     return res.status(400).json({ message: 'Utilisateur déjà existant' });
   }
   const newUser = new User({ name, email, password });
   await newUser.save();
   const token = jwt.sign({ userId: newUser._id }, 'secret_key', { expiresIn: '1h' });
   res.status(201).json({ message: 'Utilisateur créé', token });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

const loginUser = async (req, res) => {
 const { email, password } = req.body;
 try {
   const user = await User.findOne({ email });
   if (!user) return res.status(400).json({ message: 'Identifiants invalides' });
   const isMatch = await user.comparePassword(password);
   if (!isMatch) return res.status(400).json({ message: 'Identifiants invalides' });
   const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
   res.status(200).json({ message: 'Connexion réussie', token });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

module.exports = { registerUser, loginUser };

3. Middleware d'authentification (authMiddleware.js)
Il permet de vérifier si l'utilisateur est authentifié via un token JWT.
javascript
CopierModifier
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
 const token = req.headers.authorization?.split(' ')[1];
 if (!token) return res.status(403).json({ message: 'Token manquant' });

 try {
   const decoded = jwt.verify(token, 'secret_key');
   req.userId = decoded.userId;
   next();
 } catch (error) {
   res.status(401).json({ message: 'Token invalide' });
 }
};

module.exports = authenticateUser;

4. Modèles de données (Models)
Les modèles représentent la structure des documents dans MongoDB.
a) Modèle des auteurs (authorModel.js)
javascript
CopierModifier
const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
 name: { type: String, required: true },
 bio: String,
});

const Author = mongoose.model('Author', authorSchema, 'authors');
module.exports = Author;

b) Modèle des livres (bookModel.js)
javascript
CopierModifier
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
 title: { type: String, required: true },
 author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
 genre: String,
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;

c) Modèle des utilisateurs (userModel.js)
javascript
CopierModifier
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
 name: { type: String, required: true },
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
 if (!this.isModified('password')) return next();
 this.password = await bcrypt.hash(this.password, 10);
 next();
});

userSchema.methods.comparePassword = async function (password) {
 return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

5. Routes (Routes)
Les routes définissent les points de terminaison pour interagir avec l'API.
a) Routes des auteurs (authorRoutes.js)
javascript
CopierModifier
const express = require('express');
const { createAuthor, getAuthors, updateAuthor, deleteAuthor } = require('../controllers/authorController');
const router = express.Router();

router.post('/', createAuthor);
router.get('/', getAuthors);
router.put('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);

module.exports = router;

b) Routes des livres (bookRoutes.js)
javascript
CopierModifier
const express = require('express');
const { createBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');
const router = express.Router();

router.post('/books', createBook);
router.get('/books', getBooks);
router.put('/:bookId', updateBook);
router.delete('/:bookId', deleteBook);

module.exports = router;

c) Routes des utilisateurs (userRoutes.js)
javascript
CopierModifier
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

6. Fichier principal du serveur (server.js)
javascript
CopierModifier
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, { dbName: 'book' })
 .then(() => console.log('MongoDB connecté'))
 .catch(err => console.error('Erreur de connexion MongoDB :', err));

Conclusion
Ce code met en place un CRUD pour gérer les livres, les auteurs et les utilisateurs, avec une authentification par JWT pour sécuriser les routes. 

