import { useState } from 'react';
import './Participants.css';

export default function Participants({ participants = [], onKick, isTeacher }) {
    const [activeTab, setActiveTab] = useState('participants');

    return (
        <div className="participants-panel">
            <div className="participants-tabs">
                <button
                    className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                >
                    Chat
                </button>
                <button
                    className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
                    onClick={() => setActiveTab('participants')}
                >
                    Participants
                </button>
            </div>

            {activeTab === 'participants' && (
                <div className="participants-list">
                    <div className="participants-header-row">
                        <span className="col-name">Name</span>
                        {isTeacher && <span className="col-action">Action</span>}
                    </div>
                    {participants.length === 0 && (
                        <p className="no-participants">No students connected</p>
                    )}
                    {participants.map((name, idx) => (
                        <div key={idx} className="participant-row">
                            <span className="participant-name">{name}</span>
                            {isTeacher && onKick && (
                                <button
                                    className="kick-btn"
                                    onClick={() => onKick(name)}
                                >
                                    Kick out
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'chat' && (
                <div className="chat-placeholder">
                    <p className="chat-coming-soon">Chat coming soon</p>
                </div>
            )}
        </div>
    );
}
