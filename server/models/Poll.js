const { v4: uuidv4 } = require('uuid');

const polls = [];

function createPoll({ question, options, duration }) {
    // Deactivate any currently active poll
    polls.forEach(p => { p.isActive = false; });

    const poll = {
        id: uuidv4(),
        question,
        options, // [{ text, isCorrect }]
        duration: duration || 60,
        startTime: Date.now(),
        isActive: true,
        createdAt: new Date(),
    };
    polls.push(poll);
    return poll;
}

function getActivePoll() {
    return polls.find(p => p.isActive) || null;
}

function endPoll(pollId) {
    const poll = polls.find(p => p.id === pollId);
    if (poll) poll.isActive = false;
    return poll;
}

function getPollById(pollId) {
    return polls.find(p => p.id === pollId) || null;
}

function getAllPolls() {
    return polls;
}

module.exports = { polls, createPoll, getActivePoll, endPoll, getPollById, getAllPolls };
