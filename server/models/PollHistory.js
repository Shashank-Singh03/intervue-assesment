const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: String,
    votes: Number,
});

const PollHistorySchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        options: [OptionSchema],
        totalVotes: Number,
        askedBy: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('PollHistory', PollHistorySchema);
