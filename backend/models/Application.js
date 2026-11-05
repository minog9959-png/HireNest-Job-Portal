const mongoose = require('mongoose');

// Do references: job -> Job, applicant -> User
// Ek seeker ek job par dobara apply na kare, is liye unique index hai
const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Apply form se aane wala seeker ka snapshot: profile badle to bhi
    // is application par wahi detail rahegi jo apply karte waqt di thi
    applicantName: { type: String, required: true, trim: true },
    applicantEmail: { type: String, required: true, lowercase: true, trim: true },
    experience: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    coverLetter: { type: String, trim: true },
    resumeLink: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
