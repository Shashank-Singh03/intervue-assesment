const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pollController = require('./controllers/pollController');
const { registerPollSocket } = require('./sockets/pollSocket');

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://intervue-assessment.web.app',
  'https://intervue-assessment.firebaseapp.com',
];

const app = express();
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});
