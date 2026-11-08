require('dotenv').config();
const connectDB = require('../config/db');
const app = require('../server');

// Vercel serverless function: app.listen yahan nahi chalta,
// Vercel khud har request par ye function chalata hai.
// DB connection ek dafa banate hain aur warm instance par reuse karte hain.
let dbPromise = null;

module.exports = async (req, res) => {
  // CORS preflight (OPTIONS) ko DB ka wait karaye baghair foran jawab do.
  // Pehle ye request DB connect hone ka wait karti thi, is liye browser ko
  // "blocked by CORS policy / No 'Access-Control-Allow-Origin' header" milta tha.
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(503).json({ message: 'Database is waking up, please try again' });
  }
  return app(req, res);
};
