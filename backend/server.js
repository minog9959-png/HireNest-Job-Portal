require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
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
