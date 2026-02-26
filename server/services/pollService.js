const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

function createPoll({ question, options, duration }) {
    if (!question || !options || options.length < 2) {
        return { error: 'Question and at least 2 options required' };
    }
    if (question.length > 100) {
        return { error: 'Question must be 100 characters or less' };
    }

    const poll = Poll.createPoll({ question, options, duration });
    return { poll };
}

function getActivePoll() {
    const poll = Poll.getActivePoll();
    if (!poll) return null;

    const elapsed = Date.now() - poll.startTime;
    const totalMs = poll.duration * 1000;

    // Auto-expire if timer ran out
    if (elapsed >= totalMs) {
        Poll.endPoll(poll.id);
        return null;
    }

    return poll;
}

function getActivePollWithResults() {
    const poll = getActivePoll();
    if (!poll) return null;

    const votes = Vote.getVotesForPoll(poll.id);
    const results = aggregateResults(poll, votes);

    return { poll, results };
}

function endPoll(pollId) {
    return Poll.endPoll(pollId);
}

function getPollResults(pollId) {
    const poll = Poll.getPollById(pollId);
    if (!poll) return null;

    const votes = Vote.getVotesForPoll(pollId);
    return aggregateResults(poll, votes);
}

function aggregateResults(poll, votes) {
    const totalVotes = votes.length;
    return poll.options.map((opt, idx) => {
        const count = votes.filter(v => v.optionIndex === idx).length;
        return {
            text: opt.text,
            isCorrect: opt.isCorrect,
            count,
            percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
        };
    });
}

module.exports = { createPoll, getActivePoll, getActivePollWithResults, endPoll, getPollResults };
