const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/applications — sirf seeker apply karega
router.post('/', protect, authorize('seeker'), async (req, res) => {
  try {
    const { jobId, applicantName, applicantEmail, experience, phone, coverLetter, resumeLink } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const app = await Application.create({
      job: jobId,
      applicant: req.user._id,
      applicantName,
      applicantEmail,
      experience,
      phone,
      coverLetter,
      resumeLink,
    });
    res.status(201).json(app);
  } catch (e) {
    // 11000 = ek hi job par dobara apply (unique index)
    if (e.code === 11000) return res.status(400).json({ message: 'You have already applied for this job' });
    res.status(400).json({ message: e.message });
  }
});

// GET /api/applications/mine — seeker ki apni applications
router.get('/mine', protect, authorize('seeker'), async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id })
    .populate('job', 'title company location type')
    .sort('-createdAt');
  res.json(apps);
});

// GET /api/applications/job/:jobId — employer apni job ke applicants dekhe
router.get('/job/:jobId', protect, authorize('employer'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, employer: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found or this is not your job' });
  const apps = await Application.find({ job: job._id })
    .populate('applicant', 'name email skills')
    .sort('-createdAt');
  res.json(apps);
});

// PUT /api/applications/:id/status — employer status badle: shortlisted / rejected / hired
router.put('/:id/status', protect, authorize('employer'), async (req, res) => {
  const app = await Application.findById(req.params.id).populate('job');
  if (!app || String(app.job.employer) !== String(req.user._id)) {
    return res.status(404).json({ message: 'Application not found or this is not your job' });
  }
  app.status = req.body.status;
  await app.save();
  res.json(app);
});

module.exports = router;
