// Atlas ka SRV address nikalne ke liye Google DNS use karo —
// Wi-Fi ka DNS kabhi SRV query rok deta hai (querySrv ECONNREFUSED), is se wo masla nahi aata.
require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// CORS: sirf apna local frontend aur live frontend allowed hain, baqi origins block hain.
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://frontend-pi-tan-iventmxwes.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, app: 'HireNest' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

// Vercel ke liye app export karte hain, taake api/index.js ise use kar sake.
// Local run (node server.js) par hi DB connect + listen hota hai.
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`)))
    .catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
}
