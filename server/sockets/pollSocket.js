const pollService = require('../services/pollService');
const voteService = require('../services/voteService');

// Track connected students: { socketId: { name, role } }
const connectedUsers = new Map();

function registerPollSocket(io) {
    io.on('connection', (socket) => {
        console.log(`Connected: ${socket.id}`);

        // Student joins the session
        socket.on('student:join', ({ name }) => {
            connectedUsers.set(socket.id, { name, role: 'student' });
            socket.join('students');

            // Send current poll state if one is active
            const poll = pollService.getActivePoll();
            if (poll) {
                const hasVoted = voteService.hasStudentVoted(poll.id, name);
                const results = hasVoted ? pollService.getPollResults(poll.id) : null;
                socket.emit('poll:state', {
                    poll,
                    hasVoted,
                    results,
                    remainingMs: Math.max(0, poll.duration * 1000 - (Date.now() - poll.startTime)),
                });
            }

            broadcastParticipants(io);
        });

        // Teacher joins the session
        socket.on('teacher:join', () => {
            connectedUsers.set(socket.id, { name: 'Teacher', role: 'teacher' });
            socket.join('teachers');

            // Send current state
            const data = pollService.getActivePollWithResults();
            if (data) {
                socket.emit('poll:state', {
                    poll: data.poll,
                    results: data.results,
                    remainingMs: Math.max(0, data.poll.duration * 1000 - (Date.now() - data.poll.startTime)),
                });
            }

            broadcastParticipants(io);
        });

        // Teacher creates a new poll
        socket.on('teacher:create-poll', ({ question, options, duration }) => {
            const result = pollService.createPoll({ question, options, duration });

            if (result.error) {
                socket.emit('poll:error', { message: result.error });
                return;
            }

            const poll = result.poll;
            const remainingMs = poll.duration * 1000;

            // Broadcast to everyone
            io.emit('poll:start', { poll, remainingMs });

            // Set timer to auto-end the poll
            setTimeout(() => {
                const active = pollService.getActivePoll();
                if (active && active.id === poll.id) {
                    pollService.endPoll(poll.id);
                    const results = pollService.getPollResults(poll.id);
                    io.emit('poll:ended', { pollId: poll.id, results });
                }
            }, remainingMs);
        });

        // Student submits a vote
        socket.on('student:vote', ({ pollId, studentName, optionIndex }) => {
            const result = voteService.submitVote({ pollId, studentName, optionIndex });

            if (result.error) {
                socket.emit('vote:error', { message: result.error });
                return;
            }

            socket.emit('vote:accepted', { optionIndex });

            // Broadcast updated results to teachers
            const results = pollService.getPollResults(pollId);
            io.to('teachers').emit('poll:results-update', { pollId, results });
        });

        // Teacher kicks a student
        socket.on('teacher:kick', ({ studentName }) => {
            for (const [sid, user] of connectedUsers.entries()) {
                if (user.name === studentName && user.role === 'student') {
                    io.to(sid).emit('student:kicked');
                    const targetSocket = io.sockets.sockets.get(sid);
                    if (targetSocket) {
                        targetSocket.leave('students');
                    }
                    connectedUsers.delete(sid);
                    break;
                }
            }
            broadcastParticipants(io);
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`Disconnected: ${socket.id}`);
            connectedUsers.delete(socket.id);
            broadcastParticipants(io);
        });
    });
}

function broadcastParticipants(io) {
    const students = [];
    for (const [, user] of connectedUsers.entries()) {
        if (user.role === 'student') {
            students.push(user.name);
        }
    }
    io.emit('participants:update', { participants: students });
}

function getConnectedUsers() {
    return connectedUsers;
}

module.exports = { registerPollSocket, getConnectedUsers };
