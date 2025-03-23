const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
  require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);



const router = express.Router();

module.exports = router;


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, {
  dbName: 'book'
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error(' Erreur de connexion MongoDB :', err.message));

// Vérifier l'état de la connexion
const db = mongoose.connection;
db.on('connected', () => console.log(' MongoDB est connecté'));
db.on('error', (err) => console.error('Erreur de connexion à MongoDB:', err));
db.on('disconnected', () => console.warn('MongoDB déconnecté'));
