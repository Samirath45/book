const mongoose = require('mongoose');
require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecter');
    
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = { connectDB };
