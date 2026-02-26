import './StudentResults.css';

export default function StudentResults({ poll, results }) {
    if (!results || !poll) return null;

    const totalVotes = results.reduce((sum, r) => sum + r.count, 0);

    return (
        <div className="results-page">
            <div className="results-container">
                <h2 className="results-heading">Question 1 — Results</h2>

                <div className="results-card">
                    <div className="results-question-header">
                        <p>{poll.question}</p>
                    </div>
                    <div className="results-bars">
                        {results.map((r, idx) => (
                            <div key={idx} className="result-row">
                                <div className="result-label">
                                    <span className="result-num">{idx + 1}</span>
                                    <span className="result-text">{r.text}</span>
                                </div>
                                <div className="result-bar-track">
                                    <div
                                        className="result-bar-fill"
                                        style={{ width: `${r.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="result-pct">{r.percentage}%</span>
                            </div>
                        ))}
                    </div>
                    <p className="results-total">{totalVotes} vote{totalVotes !== 1 ? 's' : ''} total</p>
                </div>
            </div>
        </div>
    );
}
