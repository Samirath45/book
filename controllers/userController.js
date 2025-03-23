const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Enregistrer un nouvel utilisateur
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Générer un token
    const token = jwt.sign({ userId: newUser._id }, 'secret_key', { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Connecter un utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Générer un token
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
