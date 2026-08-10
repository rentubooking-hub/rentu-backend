# Rentu backend

Real API for the Rentu app: registration/login, listing tools, creating
bookings, and providers accepting/declining them. This is what makes the
Customer and Provider apps actually talk to each other.

Scope of this first version (on purpose, to keep it simple):
- Auth is email + password (no OTP yet)
- All providers currently see ALL pending bookings (single shared pool) —
  there's no per-provider tool ownership yet
- No payment gateway wired in — "Pay" just confirms the booking
- Provider's Add Tool / Inventory / Earnings screens are still local demo
  data, not yet connected to this backend

## 1. Set up a free database (MongoDB Atlas)

1. Go to mongodb.com/cloud/atlas and create a free account.
2. Create a free "M0" cluster (any region close to you).
3. Under Database Access, create a database user with a username/password.
4. Under Network Access, add `0.0.0.0/0` (allow access from anywhere) —
   fine for this MVP, tighten later if needed.
5. Click "Connect" → "Drivers" and copy the connection string, e.g.
   `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/rentu`
   That full string is your `MONGODB_URI`.

## 2. Deploy this folder to Render

1. Push this `rentu-backend` folder to a GitHub repo (Render deploys from
   GitHub, GitLab, or Bitbucket).
2. On render.com, click New → Web Service, and connect that repo.
3. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Under Environment, add these variables:
   - `MONGODB_URI` — the connection string from step 1
   - `JWT_SECRET` — any long random string (e.g. generate one at
     random.org or just mash the keyboard for 40+ characters)
   - `ALLOWED_ORIGINS` — your frontend's URL, e.g. `https://rentu.rf.gd`
     (comma-separate multiple origins if needed)
5. Deploy. Render gives you a URL like
   `https://rentu-backend-xxxx.onrender.com`.

Note: Render's free tier spins the service down after inactivity, so the
first request after a while takes ~30-50 seconds to wake up. That's normal
on free hosting, not a bug.

## 3. Seed sample tools

Once deployed (or even just locally), run the seed script once so there's
something for the Customer app to show:

```
MONGODB_URI="your-connection-string" npm run seed
```

You can run this from your own computer with Node installed — it doesn't
need to run on Render itself, it just needs the same `MONGODB_URI`.

## 4. Point the frontend at this backend

In the `rentu-app` project, create a `.env` file (copy `.env.example`) and
set:

```
VITE_API_URL=https://rentu-backend-xxxx.onrender.com/api
```

Then rebuild the frontend (`npm run build`) and re-upload `dist/` to
InfinityFree — the app will now hit this real backend instead of using
local sample data.

## Local development

```
npm install
cp .env.example .env   # then fill in MONGODB_URI and JWT_SECRET
npm run dev
```

Runs on http://localhost:4000 by default.
