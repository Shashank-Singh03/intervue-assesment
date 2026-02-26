# Intervue Poll System

Real-time polling system for classrooms. Teachers create timed questions, students vote live, and results update in real time.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Express + Socket.IO |
| Frontend Hosting | Firebase Hosting |
| Backend Hosting | Render |

## Project Structure

```
intervue_assignment/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
├── server/           # Express + Socket.IO backend
│   ├── models/
│   ├── services/
│   ├── controllers/
│   └── sockets/
├── firebase.json     # Firebase Hosting config
└── .firebaserc       # Firebase project alias
```

## Local Development

```bash
# Terminal 1 — Backend
cd server
npm install
npm start

# Terminal 2 — Frontend
cd client
npm install
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Deployment

### Backend (Render)

1. Push the repo to GitHub.
2. Create a **Web Service** on [Render](https://render.com).
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add environment variables if needed (e.g. `PORT`).

### Frontend (Firebase Hosting)

```bash
# 1. Set VITE_SERVER_URL to your Render backend URL
#    in client/.env.production:
#    VITE_SERVER_URL=https://your-app.onrender.com

# 2. Build
cd client && npm run build

# 3. Deploy
firebase deploy --only hosting
```

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_SERVER_URL` | `client/.env.production` | Backend URL for production builds |
| `PORT` | Render dashboard | Server port (Render sets this automatically) |
