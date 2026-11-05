# HireNest — Simple MERN Project

Ye project jaan boojh kar **simple** rakha gaya hai, taake interviewer ko samjhana easy ho.
Koi admin panel, koi file upload, koi extra feature nahi — sirf wohi jo aap ne manga tha.

## Kaam kaise karta hai — ek line me
Seeker job dhoondta hai aur apply karta hai. Employer job post karta hai aur applicants dekhta hai.

## Folder structure
```
job-portal/
├── backend/
│   ├── server.js              # Entry point
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # User, Job, Application (3 hi models)
│   ├── middleware/auth.js     # protect + authorize (JWT + role)
│   ├── routes/                # auth, jobs, applications
│   └── seed/seed.js           # 2 demo jobs + 2 demo users
└── frontend/
    └── src/
        ├── App.jsx            # Routes + Navbar
        ├── context/AuthContext.jsx  # Login user poori app me
        ├── services/api.js    # Backend calls, ek hi jagah
        ├── components/ProtectedRoute.jsx
        └── pages/             # Home, Jobs, JobDetail, Login, Register,
                               # MyApplications, PostJob, MyJobs, Applicants
```

## Models — sirf 3, aur rishta simple hai
- **User:** name, email, password, role (`seeker` ya `employer`), company/skills
- **Job:** title, company, location, type, salary, description, requirements, `employer` (User ka ID)
- **Application:** `job` (Job ka ID), `applicant` (User ka ID), coverLetter, resumeLink, status

Rishta samajhne ka easy tareeqa: Job me employer ka ID hota hai, Application me job ka ID aur seeker ka ID hota hai. `populate()` se ID ki jagah naam aa jata hai.

## API — sirf 10 routes
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs` (search/location/type filter), `GET /api/jobs/:id`
- `POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id` (sirf employer, sirf apni job)
- `GET /api/jobs/mine/list` (employer ki apni jobs)
- `POST /api/applications` (sirf seeker), `GET /api/applications/mine`
- `GET /api/applications/job/:jobId`, `PUT /api/applications/:id/status` (sirf us job ka employer)

## Chalane ka tareeqa
Backend:
```bash
cd job-portal/backend
cp .env.example .env
# .env me MONGO_URI aur JWT_SECRET likhein
npm install
npm run seed
npm run dev
```
Backend: http://localhost:5000 — check: http://localhost:5000/api/health

Frontend:
```bash
cd job-portal/frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## CV upload (Cloudinary)
Seeker Apply form me computer se PDF select karta hai. Frontend file ko FormData me bhejta hai, backend `multer` se file memory me leta hai (sirf PDF, max 5MB), phir Cloudinary par upload karta hai (`hirenest-cvs` folder) aur us ka link `resumeLink` me save karta hai. Employer Applicants page par `Download CV` se wahi PDF kholta hai. Cloudinary ki 3 values zaroori hain: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — sirf `.env` / Vercel Environment Variables me, kabhi code ya GitHub me nahi.

## Live deployment (Vercel + GitHub)
Do alag Vercel projects hain:
- **Frontend:** Vercel project ki root `frontend/` hai (Vite). Is me env var `VITE_API_URL` set karein, live backend ki taraf, jaise `https://<backend-project>.vercel.app/api`.
- **Backend:** Vercel project ki root `backend/` hai. `backend/api/index.js` Express app ko serverless function ki tarah chalata hai, aur `backend/vercel.json` har request ko usi taraf bhejta hai. Is me 2 env vars zaroori hain: `MONGO_URI` (Atlas connection string) aur `JWT_SECRET` (apni random string).
- Secrets kabhi code ya GitHub me nahi likhne — sirf Vercel dashboard ke Environment Variables me set karein.

Demo login (seed ke baad):
- Seeker: `seeker@demo.local` / `123456`
- Employer: `employer@demo.local` / `123456`

## Interview ke liye
`INTERVIEW-GUIDE.md` dekhein — us me 2-minute intro aur har sawal ka short jawab Roman Urdu me hai.
