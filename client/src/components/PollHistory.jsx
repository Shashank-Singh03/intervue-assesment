import { useState, useEffect } from 'react';
import './PollHistory.css';

const SERVER_URL = (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000').replace(/\/+$/, '');

export default function PollHistory({ onBack }) {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${SERVER_URL}/api/poll/history`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setPolls(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="poll-history-page">
                <button className="back-btn" onClick={onBack}>← Back</button>
                <h1 className="poll-history-heading">View <strong>Poll History</strong></h1>
                <p className="poll-history-loading">Loading history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="poll-history-page">
                <button className="back-btn" onClick={onBack}>← Back</button>
                <h1 className="poll-history-heading">View <strong>Poll History</strong></h1>
                <p className="poll-history-error">Failed to load history. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="poll-history-page">
            <button className="back-btn" onClick={onBack}>← Back</button>
            <h1 className="poll-history-heading">View <strong>Poll History</strong></h1>

            {polls.length === 0 && (
                <p className="poll-history-empty">No polls have been conducted yet.</p>
            )}

            {polls.map((poll, idx) => {
                const totalVotes = poll.totalVotes || 0;
                return (
                    <div key={poll._id || idx} className="poll-history-item">
                        <h3 className="poll-history-question-label">Question {idx + 1}</h3>
                        <div className="poll-history-card">
                            <div className="poll-history-question-header">
                                <p>{poll.question}</p>
                            </div>
                            <div className="poll-history-bars">
                                {poll.options.map((opt, optIdx) => {
                                    const pct = totalVotes > 0
                                        ? Math.round((opt.votes / totalVotes) * 100)
                                        : 0;
                                    return (
                                        <div key={optIdx} className="poll-history-result-row">
                                            <div className="poll-history-result-label">
                                                <span className="poll-history-result-num">{optIdx + 1}</span>
                                                <span className="poll-history-result-text">{opt.text}</span>
                                            </div>
                                            <div className="poll-history-bar-track">
                                                <div
                                                    className="poll-history-bar-fill"
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                            </div>
                                            <span className="poll-history-pct">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
