const express = require('express');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/jobs?search=react&location=lahore&type=Remote
// Sab dekh sakte hain, login zaroori nahi — yehi browse/search/filter hai
router.get('/', async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const filter = { isActive: true };
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    const jobs = await Job.find(filter).populate('employer', 'name company').sort('-createdAt');
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET /api/jobs/:id — ek job ki detail
router.get('/:id', async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employer', 'name company');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

// POST /api/jobs — sirf employer post karega
router.post('/', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employer: req.user._id });
    res.status(201).json(job);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// GET /api/jobs/mine/list — employer ki apni jobs (edit/delete ke liye)
// Note: ye route /:id se pehle hai, warna "mine" ko id samajh liya jata
router.get('/mine/list', protect, authorize('employer'), async (req, res) => {
  res.json(await Job.find({ employer: req.user._id }).sort('-createdAt'));
});

// PUT /api/jobs/:id — sirf wohi employer edit kare jo job ka malik hai
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, employer: req.user._id },
    req.body,
    { new: true }
  );
  if (!job) return res.status(404).json({ message: 'Job not found or this is not your job' });
  res.json(job);
});

// DELETE /api/jobs/:id — sirf malik employer delete kare
router.delete('/:id', protect, authorize('employer'), async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found or this is not your job' });
  res.json({ message: 'Job deleted successfully' });
});

module.exports = router;
