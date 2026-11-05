require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Job.deleteMany({});

  const employer = await User.create({
    name: 'Tech Company',
    email: 'employer@demo.local',
    password: '123456',
    role: 'employer',
    company: 'Tech Company',
  });
  await User.create({
    name: 'Demo Seeker',
    email: 'seeker@demo.local',
    password: '123456',
    role: 'seeker',
    skills: 'React, Node.js',
  });

  await Job.create([
    {
      title: 'Frontend Developer (React)',
      company: 'Tech Company',
      location: 'Lahore',
      type: 'Full-time',
      salary: '80,000 - 120,000 PKR',
      description: 'Build a simple and clean UI using React.',
      requirements: 'React, JavaScript, HTML, CSS',
      employer: employer._id,
    },
    {
      title: 'MERN Stack Intern',
      company: 'Tech Company',
      location: 'Remote',
      type: 'Internship',
      salary: '30,000 PKR',
      description: 'A chance to learn MERN and build small features.',
      requirements: 'JavaScript, Node.js, MongoDB basics',
      employer: employer._id,
    },
  ]);
  console.log('Seed done. Seeker: seeker@demo.local / 123456 | Employer: employer@demo.local / 123456');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
