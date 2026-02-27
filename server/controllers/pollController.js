const express = require('express');
const router = express.Router();
const pollService = require('../services/pollService');
const voteService = require('../services/voteService');
const { getPollHistory } = require('./pollHistoryController');

// History endpoint (must be before :id param routes)
router.get('/history', getPollHistory);

// Get the currently active poll (with remaining time)
router.get('/active', (req, res) => {
    const poll = pollService.getActivePoll();
    if (!poll) {
        return res.json({ poll: null });
    }

    const remaining = Math.max(0, poll.duration * 1000 - (Date.now() - poll.startTime));
    res.json({ poll, remainingMs: remaining });
});

// Get results for a specific poll
router.get('/:id/results', (req, res) => {
    const results = pollService.getPollResults(req.params.id);
    if (!results) {
        return res.status(404).json({ error: 'Poll not found' });
    }
    res.json({ results });
});

// Check if a student has voted
router.get('/:id/has-voted/:studentName', (req, res) => {
    const voted = voteService.hasStudentVoted(req.params.id, req.params.studentName);
    res.json({ hasVoted: voted });
});

module.exports = router;
