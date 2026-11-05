require('dotenv').config();
const connectDB = require('../config/db');
const app = require('../server');

// Vercel serverless function: app.listen yahan nahi chalta,
// Vercel khud har request par ye function chalata hai.
// DB connection ek dafa banate hain aur warm instance par reuse karte hain.
let dbPromise = null;

module.exports = async (req, res) => {
  if (!dbPromise) {
    dbPromise = connectDB().catch((e) => {
      dbPromise = null;
      throw e;
    });
  }
  await dbPromise;
  return app(req, res);
};
