import { useState } from 'react';
import Participants from './Participants';
import './FloatingChatButton.css';

export default function FloatingChatButton({ participants, onKick, isTeacher, chatMessages, onSendChat, userName }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="floating-chat-wrapper">
            {isOpen && (
                <div className="floating-panel">
                    <Participants
                        participants={participants}
                        onKick={onKick}
                        isTeacher={isTeacher}
                        chatMessages={chatMessages}
                        onSendChat={onSendChat}
                        userName={userName}
                    />
                </div>
            )}
            <button
                className="floating-chat-btn"
                onClick={() => setIsOpen(prev => !prev)}
                id="floating-chat-toggle"
                aria-label="Toggle chat and participants"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white" />
                    <path d="M4 4H20V16H5.17L4 17.17V4Z" fill="white" fillOpacity="0.3" />
                </svg>
            </button>
        </div>
    );
}
