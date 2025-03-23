const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// Enregistrer un utilisateur
router.post('/register', registerUser);

// Connecter un utilisateur
router.post('/login', loginUser);

module.exports = router;