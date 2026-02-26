import './RoleSelection.css';

export default function RoleSelection({ onSelectRole }) {
    return (
        <div className="role-selection">
            <div className="role-content">
                <h1 className="role-heading">Welcome to the Live Polling System</h1>
                <p className="role-subtitle">Please select your role to continue</p>
                <div className="role-cards">
                    <button className="role-card" id="role-student" onClick={() => onSelectRole('student')}>
                        <div className="role-icon">🎓</div>
                        <h2>Join as a Student</h2>
                        <p>Submit your answers, participate in live polls, and see how your responses compare with your classmates</p>
                    </button>
                    <button className="role-card" id="role-teacher" onClick={() => onSelectRole('teacher')}>
                        <div className="role-icon">👨‍🏫</div>
                        <h2>Join as a Teacher</h2>
                        <p>Create and manage polls, ask questions, and monitor student responses in real-time</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
