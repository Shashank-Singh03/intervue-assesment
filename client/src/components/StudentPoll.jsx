import { useState } from 'react';
import { usePollTimer } from '../hooks/usePollTimer';
import './StudentPoll.css';

export default function StudentPoll({ poll, onVote, hasVoted, selectedOption }) {
    const [selected, setSelected] = useState(selectedOption ?? null);
    const { formatted, isExpired } = usePollTimer(poll.startTime, poll.duration);

    const handleSubmit = () => {
        if (selected !== null && !hasVoted) {
            onVote(selected);
        }
    };

    return (
        <div className="poll-page">
            <div className="poll-container">
                <div className="poll-header-row">
                    <h2 className="poll-question-num">Question 1</h2>
                    <div className="poll-timer">
                        <span className="timer-icon">⏱</span>
                        <span className="timer-value">{formatted}</span>
                    </div>
                </div>

                <div className="poll-card">
                    <div className="poll-question-header">
                        <p>{poll.question}</p>
                    </div>
                    <div className="poll-options">
                        {poll.options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`poll-option ${selected === idx ? 'selected' : ''} ${hasVoted ? 'disabled' : ''}`}
                                onClick={() => !hasVoted && setSelected(idx)}
                                disabled={hasVoted || isExpired}
                                id={`option-${idx}`}
                            >
                                <span className={`option-num ${selected === idx ? 'active' : ''}`}>{idx + 1}</span>
                                <span className="option-text">{opt.text}</span>
                            </button>
                        ))}
                    </div>
                    {!hasVoted && !isExpired && (
                        <div className="poll-submit-row">
                            <button
                                className="btn-submit"
                                onClick={handleSubmit}
                                disabled={selected === null}
                                id="submit-vote"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    {hasVoted && (
                        <div className="poll-voted-msg">✓ Vote submitted</div>
                    )}
                </div>
            </div>
        </div>
    );
}
