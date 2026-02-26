const Vote = require('../models/Vote');
const Poll = require('../models/Poll');

function submitVote({ pollId, studentName, optionIndex }) {
    const poll = Poll.getActivePoll();

    if (!poll || poll.id !== pollId) {
        return { error: 'NO_ACTIVE_POLL' };
    }

    // Check timer — if poll expired, don't accept vote
    const elapsed = Date.now() - poll.startTime;
    if (elapsed >= poll.duration * 1000) {
        Poll.endPoll(poll.id);
        return { error: 'POLL_EXPIRED' };
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
        return { error: 'INVALID_OPTION' };
    }

    const result = Vote.addVote({ pollId, studentName, optionIndex });
    if (result.error) {
        return { error: result.error };
    }

    return { vote: result.vote };
}

function getVotesForPoll(pollId) {
    return Vote.getVotesForPoll(pollId);
}

function hasStudentVoted(pollId, studentName) {
    return Vote.hasVoted(pollId, studentName);
}

module.exports = { submitVote, getVotesForPoll, hasStudentVoted };
