const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Role hi poora system chalata hai:
// seeker = job dhoondne wala, employer = job post karne wala
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['seeker', 'employer'], required: true },
    company: { type: String, trim: true }, // sirf employer ke liye
    skills: { type: String, trim: true }, // sirf seeker ke liye, comma se alag
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
