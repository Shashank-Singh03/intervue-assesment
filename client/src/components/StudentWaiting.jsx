import './StudentWaiting.css';

export default function StudentWaiting() {
    return (
        <div className="waiting-page">
            <div className="waiting-content">
                <div className="waiting-badge">✦ Intervue Poll</div>
                <div className="waiting-spinner"></div>
                <p className="waiting-text">Wait for the teacher to ask questions..</p>
            </div>
        </div>
    );
}
