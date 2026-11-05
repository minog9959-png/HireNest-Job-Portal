const mongoose = require('mongoose');

// employer field ek reference hai: Job -> User (ObjectId)
// populate() se employer ka naam/company job ke sath mil jata hai
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Internship'],
      default: 'Full-time',
    },
    salary: { type: String, trim: true },
    description: { type: String, required: true },
    requirements: { type: String, trim: true }, // comma se alag skills
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
