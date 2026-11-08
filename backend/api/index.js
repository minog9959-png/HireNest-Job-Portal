require('dotenv').config();
const connectDB = require('../config/db');
const app = require('../server');

// Vercel serverless function: app.listen yahan nahi chalta,
// Vercel khud har request par ye function chalata hai.
// DB connection ek dafa banate hain aur warm instance par reuse karte hain.
let dbPromise = null;

module.exports = async (req, res) => {
  try {
    if (!dbPromise) {
      dbPromise = connectDB().catch((e) => {
        dbPromise = null;
        throw e;
      });
    }
    await dbPromise;
  } catch (e) {
    // Database connect na ho to connection toro mat (warna browser ko
    // "Failed to fetch" milta hai) — saaf 503 jawab do, dobara try ho sake
    return res.status(503).json({ message: 'Database is waking up, please try again' });
  }
  return app(req, res);
};
