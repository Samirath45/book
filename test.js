require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connexion réussie à MongoDB !");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur de connexion :", error.message);
  }
}

testConnection();
