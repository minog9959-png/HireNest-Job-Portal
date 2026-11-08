const mongoose = require('mongoose');

async function connectDB() {
  // Agar connection pehle se hai ya ban rahi hai, to dobara connect mat karo
  // (Vercel par har cold request par naya connect hi sab se slow hissa hai)
  if (mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return;
  }
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not found in .env');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
