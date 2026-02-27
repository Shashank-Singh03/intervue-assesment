console.log("BOOT: entry file loaded");
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pollController = require('./controllers/pollController');
const { registerPollSocket } = require('./sockets/pollSocket');

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.CORS_ORIGIN,       // e.g. https://intervue-assesment.onrender.com
].filter(Boolean);

const app = express();

// --- Render health check (must be early) ---
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());


// REST routes
app.use('/api/poll', pollController);

// Socket.IO
registerPollSocket(io);

// Serve React client build in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});
