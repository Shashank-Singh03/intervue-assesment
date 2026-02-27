const PollHistory = require('../models/PollHistory');

exports.getPollHistory = async (_req, res) => {
    try {
        const polls = await PollHistory.find()
            .sort({ createdAt: -1 })
            .lean();

        res.json(polls);
    } catch (err) {
        console.error('Poll history fetch failed', err);
        res.status(500).json({ message: 'Failed to fetch poll history' });
    }
};
