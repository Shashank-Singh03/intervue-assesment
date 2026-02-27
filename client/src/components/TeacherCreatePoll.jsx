import { useState } from 'react';
import './TeacherCreatePoll.css';

const TIMER_OPTIONS = [15, 30, 45, 60, 90, 120];

export default function TeacherCreatePoll({ onCreatePoll, onBack, onViewHistory }) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);
    const [duration, setDuration] = useState(60);

    const updateOption = (idx, field, value) => {
        setOptions(prev => prev.map((opt, i) => i === idx ? { ...opt, [field]: value } : opt));
    };

    const addOption = () => {
        if (options.length < 6) {
            setOptions(prev => [...prev, { text: '', isCorrect: false }]);
        }
    };

    const removeOption = (idx) => {
        if (options.length > 2) {
            setOptions(prev => prev.filter((_, i) => i !== idx));
        }
    };

    const handleSubmit = () => {
        const validOptions = options.filter(o => o.text.trim());
        if (question.trim() && validOptions.length >= 2) {
            onCreatePoll({ question: question.trim(), options: validOptions, duration });
        }
    };

    const validOptions = options.filter(o => o.text.trim());
    const isValid = question.trim() && validOptions.length >= 2;

    return (
        <div className="create-poll-page">
            <div className="create-poll-container">
                <div className="create-poll-top-row">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    {onViewHistory && (
                        <button className="btn-view-history" onClick={onViewHistory}>
                            ⏺ View Poll history
                        </button>
                    )}
                </div>
                <h1 className="create-heading">Create a New Question</h1>
                <p className="create-subtitle">
                    Enter your question and add answer options. You can mark the correct answer and set a timer duration.
                </p>

                <div className="create-card">
                    <div className="form-group">
                        <label htmlFor="poll-question">Your Question</label>
                        <textarea
                            id="poll-question"
                            className="question-textarea"
                            placeholder="Type your question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
                            rows={3}
                        />
                        <span className="char-count">{question.length}/100</span>
                    </div>

                    <div className="options-section">
                        <label>Answer Options</label>
                        {options.map((opt, idx) => (
                            <div key={idx} className="option-input-row">
                                <span className="option-index">{idx + 1}</span>
                                <input
                                    type="text"
                                    className="option-input"
                                    placeholder={`Option ${idx + 1}`}
                                    value={opt.text}
                                    onChange={(e) => updateOption(idx, 'text', e.target.value)}
                                    id={`option-input-${idx}`}
                                />
                                <label className="correct-toggle">
                                    <input
                                        type="radio"
                                        name="correct-option"
                                        checked={opt.isCorrect}
                                        onChange={() => {
                                            setOptions(prev => prev.map((o, i) => ({ ...o, isCorrect: i === idx })));
                                        }}
                                    />
                                    <span className="correct-label">Correct</span>
                                </label>
                                {options.length > 2 && (
                                    <button className="remove-option" onClick={() => removeOption(idx)}>×</button>
                                )}
                            </div>
                        ))}
                        {options.length < 6 && (
                            <button className="add-option-btn" onClick={addOption}>+ Add More option</button>
                        )}
                    </div>

                    <div className="timer-section">
                        <label htmlFor="timer-select">Timer Duration</label>
                        <select
                            id="timer-select"
                            className="timer-select"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                        >
                            {TIMER_OPTIONS.map(t => (
                                <option key={t} value={t}>{t} seconds</option>
                            ))}
                        </select>
                    </div>

                    <div className="create-submit-row">
                        <button
                            className="btn-ask-question"
                            onClick={handleSubmit}
                            disabled={!isValid}
                            id="ask-question"
                        >
                            Ask Question
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
