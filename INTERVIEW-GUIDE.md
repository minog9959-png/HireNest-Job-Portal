# Interview Guide — Job Portal (Easy Version)

## 2-minute intro — yehi bolna hai
> "Maine ek simple Job Portal banaya hai, MERN stack me. Is me do roles hain: Job Seeker aur Employer.
> Seeker register karke jobs browse karta hai, search aur filter karta hai, phir apply karta hai aur apni applications ka status dekhta hai.
> Employer job post karta hai, apni jobs edit ya delete karta hai, aur apni job ke applicants dekh kar unka status shortlisted, rejected ya hired karta hai.
> Backend me Node aur Express se REST APIs banayi hain, MongoDB me sirf 3 models hain — User, Job aur Application — aur login ke liye JWT use kiya hai."

Bas. Is se zyada lamba intro mat dena. Interviewer khud agla sawal poochega.

## Agar pooche: "Project me kya kya hai?"
Short jawab: "Auth, role-based access, jobs CRUD, search/filter, aur applications with status. Bas yehi core hai, maine isay jaan boojh kar simple rakha hai taake har feature poori tarah kaam kare."

## Agar pooche: "JWT kaise kaam karta hai?"
"Login par backend password check karke ek token deta hai. Frontend wo token localStorage me rakhta hai aur har protected request ke sath `Authorization: Bearer <token>` header me bhejta hai. Backend ka `protect` middleware token verify karta hai, sahi ho to user mil jata hai, ghalat ho to 401 milta hai."

## Agar pooche: "Role kaise rokte ho?"
"Do middleware hain: `protect` login check karta hai, `authorize('employer')` ya `authorize('seeker')` role check karta hai. Aur edit/delete me main ye bhi check karti hun ke job ka employer wahi logged-in user ho — sirf role kafi nahi, ownership bhi zaroori hai."

## Agar pooche: "MongoDB me rishta (relationship) kaise banaya?"
"ID se. Job me `employer` field User ka ObjectId hai, Application me `job` aur `applicant` dono ObjectId hain. Jab data chahiye hota hai to `populate()` se ID ki jagah naam aur company aa jati hai. Yehi Mongoose reference hai."

## Agar pooche: "Search/filter kaise hota hai?"
"Frontend teeno inputs se query banata hai, jaise `/jobs?search=react&location=lahore&type=Remote`. Backend us query se MongoDB filter banata hai, title aur location par case-insensitive regex lagata hai. Filter backend par hai, is liye data chhota aur sahi aata hai."

## Agar pooche: "Ek seeker dobara apply kyun nahi kar sakta?"
"Application model me job + applicant par unique index hai. Dobara apply par MongoDB 11000 error deta hai, aur main usay simple message me badal deti hun: 'Aap is job par pehle apply kar chuki hain.'"

## Agar pooche: "Protected Routes kya hain?"
"Frontend me `ProtectedRoute` component hai. Login na ho to wo login page par bhej deta hai, aur role match na ho to page nahi kholta. Jaise My Applications sirf seeker ke liye, My Jobs sirf employer ke liye."

## Agar pooche: "Is me sab se mushkil kya tha?"
"Ownership check. Pehle sirf role check tha, to koi bhi employer kisi ki bhi job edit kar sakta tha. Phir maine har edit/delete/status change me ye check lagaya ke wo job ya application usi employer ki ho. Yehi asli security hai."

## Quick revision — 9 points yaad rakhein
1. 2 roles: seeker, employer
2. 3 models: User, Job, Application — rishta ID + populate se
3. JWT: login par token, har request me header, protect middleware
4. Role + ownership: authorize ke sath job ka malik bhi check hota hai
5. Search/filter backend par, unique index dobara apply rokta hai
6. Forgot password: random token banta hai, us ka hash + 15 minute expiry DB me, link se naya password set hota hai
7. Applied jobs par green "Applied" badge, Job Detail kholo to Apply button disabled hota hai
8. DNS: server.js me Google DNS set hai taake Atlas ka SRV address mile; CORS: sirf localhost:5173 aur live frontend allowed hain
9. Cold start: Vercel serverless backend der baad sota hai, pehli request fail ho sakti hai — is liye GitHub Action har 5 minute me /api/health ping karke backend garam rakhta hai, aur Jobs/Login fail ho to khud dobara try karte hain, pehle "Loading..." dikhta hai

## Demo dikhane ka order (agar laptop par dikhana ho)
1. Seeker login → Jobs → Search "React" → Job detail → Apply
2. My Applications me status "pending" dikhayein, job ke samne green "Applied" badge dikhega; dobara Job Detail kholo to Apply button disabled milega
3. Logout → Employer login → My Jobs → Applicants → Shortlist karein
4. Wapis seeker login → status ab "shortlisted" dikhega
5. Login page par "Forgot password?" → email dalo → reset link se naya password set karo → naye password se login karo
