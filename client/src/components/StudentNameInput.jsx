import { useState } from 'react';
import './StudentNameInput.css';

export default function StudentNameInput({ onSubmit, onBack }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <div className="name-input-page">
            <div className="name-input-card">
                <button className="back-btn" onClick={onBack}>← Back</button>
                <h1 className="name-heading">Let's Get Started</h1>
                <p className="name-subtitle">
                    As a student, you'll be able to <strong>submit your answers</strong>, participate in live
                    polls, and see how your responses compare with your classmates
                </p>
                <form onSubmit={handleSubmit}>
                    <label className="name-label" htmlFor="student-name">Enter your Name</label>
                    <input
                        id="student-name"
                        type="text"
                        className="name-input"
                        placeholder="Rahul Bajaj"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="btn-continue" disabled={!name.trim()}>
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}
