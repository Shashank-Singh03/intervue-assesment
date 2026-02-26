const { v4: uuidv4 } = require('uuid');

const votes = [];

function addVote({ pollId, studentName, optionIndex }) {
    // Check for duplicate (same student + same poll)
    const existing = votes.find(v => v.pollId === pollId && v.studentName === studentName);
    if (existing) {
        return { error: 'ALREADY_VOTED' };
    }

    const vote = {
        id: uuidv4(),
        pollId,
        studentName,
        optionIndex,
        createdAt: new Date(),
    };
    votes.push(vote);
    return { vote };
}

function getVotesForPoll(pollId) {
    return votes.filter(v => v.pollId === pollId);
}

function hasVoted(pollId, studentName) {
    return votes.some(v => v.pollId === pollId && v.studentName === studentName);
}

module.exports = { votes, addVote, getVotesForPoll, hasVoted };
