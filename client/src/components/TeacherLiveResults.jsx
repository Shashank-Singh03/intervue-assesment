import { usePollTimer } from '../hooks/usePollTimer';
import './TeacherLiveResults.css';

export default function TeacherLiveResults({ poll, results, onNewPoll, onBack }) {
    const { formatted, isExpired } = usePollTimer(poll?.startTime, poll?.duration);

    if (!poll) return null;

    const totalVotes = results ? results.reduce((sum, r) => sum + r.count, 0) : 0;

    return (
        <div className="teacher-results-page">
            <button className="back-btn" onClick={onBack}>← Back</button>
            <div className="teacher-results-header">
                <h2>Live Poll Results</h2>
                <div className="teacher-timer">
                    <span className="timer-icon">⏱</span>
                    <span className={`timer-value ${isExpired ? 'expired' : ''}`}>
                        {isExpired ? 'Ended' : formatted}
                    </span>
                </div>
            </div>

            <div className="teacher-results-card">
                <div className="teacher-question-header">
                    <p>{poll.question}</p>
                </div>
                <div className="teacher-results-bars">
                    {results && results.map((r, idx) => (
                        <div key={idx} className="teacher-result-row">
                            <div className="teacher-result-label">
                                <span className="teacher-result-num">{idx + 1}</span>
                                <span className="teacher-result-text">{r.text}</span>
                            </div>
                            <div className="teacher-result-bar-track">
                                <div
                                    className="teacher-result-bar-fill"
                                    style={{ width: `${r.percentage}%` }}
                                ></div>
                            </div>
                            <span className="teacher-result-pct">{r.percentage}%</span>
                            <span className="teacher-result-count">({r.count})</span>
                        </div>
                    ))}
                </div>
                <p className="teacher-results-total">{totalVotes} vote{totalVotes !== 1 ? 's' : ''} total</p>
            </div>

            {isExpired && (
                <div className="new-poll-row">
                    <button className="btn-new-poll" onClick={onNewPoll}>Create New Question</button>
                </div>
            )}
        </div>
    );
}
