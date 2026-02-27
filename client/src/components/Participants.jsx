import { useState, useEffect, useRef } from 'react';
import './Participants.css';

export default function Participants({ participants = [], onKick, isTeacher, chatMessages = [], onSendChat, userName }) {
    const [activeTab, setActiveTab] = useState('participants');
    const [chatInput, setChatInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (chatInput.trim() && onSendChat) {
            onSendChat(chatInput.trim());
            setChatInput('');
        }
    };

    // Students: chat only, no tabs
    if (!isTeacher) {
        return (
            <div className="participants-panel">
                <div className="participants-tabs">
                    <button className="tab-btn active">Chat</button>
                </div>
                <div className="chat-section">
                    <div className="chat-messages">
                        {chatMessages.length === 0 && (
                            <p className="chat-empty">No messages yet</p>
                        )}
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`chat-msg ${msg.sender === userName ? 'chat-msg-own' : ''}`}>
                                <span className={`chat-sender ${msg.role === 'teacher' ? 'chat-sender-teacher' : ''}`}>
                                    {msg.sender}
                                </span>
                                <span className="chat-text">{msg.text}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-row" onSubmit={handleSend}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type a message..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            maxLength={500}
                        />
                        <button type="submit" className="chat-send-btn" disabled={!chatInput.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Teachers: both tabs
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
                <div className="chat-section">
                    <div className="chat-messages">
                        {chatMessages.length === 0 && (
                            <p className="chat-empty">No messages yet</p>
                        )}
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`chat-msg ${msg.sender === userName ? 'chat-msg-own' : ''}`}>
                                <span className={`chat-sender ${msg.role === 'teacher' ? 'chat-sender-teacher' : ''}`}>
                                    {msg.sender}
                                </span>
                                <span className="chat-text">{msg.text}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-row" onSubmit={handleSend}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type a message..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            maxLength={500}
                        />
                        <button type="submit" className="chat-send-btn" disabled={!chatInput.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
