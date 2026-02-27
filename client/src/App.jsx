import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import RoleSelection from './components/RoleSelection';
import StudentNameInput from './components/StudentNameInput';
import StudentWaiting from './components/StudentWaiting';
import StudentPoll from './components/StudentPoll';
import StudentResults from './components/StudentResults';
import TeacherCreatePoll from './components/TeacherCreatePoll';
import TeacherLiveResults from './components/TeacherLiveResults';
import StudentKicked from './components/StudentKicked';
import FloatingChatButton from './components/FloatingChatButton';
import './App.css';

export default function App() {
  const { socket, isConnected, emit, on, off } = useSocket();

  // Shared state
  const [role, setRole] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [activePoll, setActivePoll] = useState(null);
  const [results, setResults] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Determine which screen to show
  const [screen, setScreen] = useState('role-select');

  // Restore state from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('poll-state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.role) setRole(data.role);
        if (data.studentName) setStudentName(data.studentName);
        if (data.screen) setScreen(data.screen);
        if (data.hasVoted) setHasVoted(data.hasVoted);
        if (data.selectedOption !== undefined) setSelectedOption(data.selectedOption);
      } catch { }
    }
  }, []);

  // Push browser history when screen changes (enables browser back button)
  useEffect(() => {
    if (screen !== 'role-select') {
      window.history.pushState({ screen }, '', window.location.pathname);
    }
  }, [screen]);

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = () => {
      setRole(null);
      setStudentName('');
      setActivePoll(null);
      setResults(null);
      setHasVoted(false);
      setSelectedOption(null);
      setScreen('role-select');
      sessionStorage.removeItem('poll-state');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Persist state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('poll-state', JSON.stringify({
      role, studentName, screen, hasVoted, selectedOption,
    }));
  }, [role, studentName, screen, hasVoted, selectedOption]);

  // Rejoin on reconnect
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (role === 'student' && studentName) {
      emit('student:join', { name: studentName });
    } else if (role === 'teacher') {
      emit('teacher:join', {});
    }
  }, [socket, isConnected, role, studentName, emit]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handlePollState = (data) => {
      if (!role || !data.poll) return;
      setActivePoll(data.poll);
      if (data.hasVoted) {
        setHasVoted(true);
      }
      if (data.results) {
        setResults(data.results);
        if (role === 'student' && data.hasVoted) {
          setScreen('student-results');
        } else if (role === 'student') {
          setScreen('student-poll');
        } else if (role === 'teacher') {
          setScreen('teacher-live');
        }
      } else {
        if (role === 'student') setScreen('student-poll');
        if (role === 'teacher') setScreen('teacher-live');
      }
    };

    const handlePollStart = (data) => {
      if (!role) return;
      setActivePoll(data.poll);
      setResults(null);
      setHasVoted(false);
      setSelectedOption(null);
      if (role === 'student') setScreen('student-poll');
      if (role === 'teacher') setScreen('teacher-live');
    };

    const handlePollEnded = (data) => {
      setResults(data.results);
      if (role === 'student') setScreen('student-results');
    };

    const handleVoteAccepted = (data) => {
      setHasVoted(true);
      setSelectedOption(data.optionIndex);
    };

    const handleVoteError = (data) => {
      setError(data.message);
      setTimeout(() => setError(null), 3000);
    };

    const handlePollError = (data) => {
      setError(data.message);
      setTimeout(() => setError(null), 3000);
    };

    const handleResultsUpdate = (data) => {
      setResults(data.results);
    };

    const handleParticipantsUpdate = (data) => {
      setParticipants(data.participants);
    };

    const handleKicked = () => {
      setActivePoll(null);
      setResults(null);
      setHasVoted(false);
      setSelectedOption(null);
      setScreen('student-kicked');
      sessionStorage.removeItem('poll-state');
    };

    on('poll:state', handlePollState);
    on('poll:start', handlePollStart);
    on('poll:ended', handlePollEnded);
    on('vote:accepted', handleVoteAccepted);
    on('vote:error', handleVoteError);
    on('poll:error', handlePollError);
    on('poll:results-update', handleResultsUpdate);
    on('participants:update', handleParticipantsUpdate);
    on('student:kicked', handleKicked);

    const handleChatMessage = (data) => {
      setChatMessages(prev => [...prev, data.message]);
    };
    const handleChatHistory = (data) => {
      setChatMessages(data.messages || []);
    };
    on('chat:message', handleChatMessage);
    on('chat:history', handleChatHistory);

    return () => {
      off('poll:state', handlePollState);
      off('poll:start', handlePollStart);
      off('poll:ended', handlePollEnded);
      off('vote:accepted', handleVoteAccepted);
      off('vote:error', handleVoteError);
      off('poll:error', handlePollError);
      off('poll:results-update', handleResultsUpdate);
      off('participants:update', handleParticipantsUpdate);
      off('student:kicked', handleKicked);
      off('chat:message', handleChatMessage);
      off('chat:history', handleChatHistory);
    };
  }, [socket, on, off, role]);

  // Event handlers
  const handleGoBack = useCallback(() => {
    setRole(null);
    setStudentName('');
    setActivePoll(null);
    setResults(null);
    setHasVoted(false);
    setSelectedOption(null);
    setChatMessages([]);
    setScreen('role-select');
    sessionStorage.removeItem('poll-state');
    window.history.back();
  }, []);

  const handleSelectRole = useCallback((selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setScreen('student-name');
    } else {
      emit('teacher:join', {});
      setScreen('teacher-create');
    }
  }, [emit]);

  const handleStudentNameSubmit = useCallback((name) => {
    setStudentName(name);
    emit('student:join', { name });
    setScreen('student-waiting');
  }, [emit]);

  const handleSendChat = useCallback((message) => {
    emit('chat:send', { message });
  }, [emit]);

  const handleVote = useCallback((optionIndex) => {
    if (!activePoll) return;
    // Optimistic UI
    setHasVoted(true);
    setSelectedOption(optionIndex);
    emit('student:vote', {
      pollId: activePoll.id,
      studentName,
      optionIndex,
    });
  }, [activePoll, studentName, emit]);

  const handleCreatePoll = useCallback((pollData) => {
    emit('teacher:create-poll', pollData);
  }, [emit]);

  const handleKick = useCallback((name) => {
    emit('teacher:kick', { studentName: name });
  }, [emit]);

  const handleNewPoll = useCallback(() => {
    setActivePoll(null);
    setResults(null);
    setScreen('teacher-create');
  }, []);

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case 'role-select':
        return <RoleSelection onSelectRole={handleSelectRole} />;

      case 'student-name':
        return <StudentNameInput onSubmit={handleStudentNameSubmit} onBack={handleGoBack} />;

      case 'student-waiting':
        return <StudentWaiting />;

      case 'student-poll':
        return activePoll ? (
          <StudentPoll
            poll={activePoll}
            onVote={handleVote}
            hasVoted={hasVoted}
            selectedOption={selectedOption}
          />
        ) : (
          <StudentWaiting />
        );

      case 'student-results':
        return activePoll ? (
          <StudentResults poll={activePoll} results={results} />
        ) : (
          <StudentWaiting />
        );

      case 'student-kicked':
        return <StudentKicked />;

      case 'teacher-create':
        return <TeacherCreatePoll onCreatePoll={handleCreatePoll} onBack={handleGoBack} />;

      case 'teacher-live':
        return (
          <TeacherLiveResults
            poll={activePoll}
            results={results}
            onNewPoll={handleNewPoll}
            onBack={handleGoBack}
          />
        );

      default:
        return <RoleSelection onSelectRole={handleSelectRole} />;
    }
  };

  return (
    <div className="app">
      {!isConnected && screen !== 'student-kicked' && (
        <div className="reconnect-banner">
          Reconnecting to server...
        </div>
      )}
      {error && (
        <div className="error-toast">
          {error}
        </div>
      )}
      {renderScreen()}
      {role && (
        <FloatingChatButton
          participants={participants}
          onKick={role === 'teacher' ? handleKick : undefined}
          isTeacher={role === 'teacher'}
          chatMessages={chatMessages}
          onSendChat={handleSendChat}
          userName={role === 'teacher' ? 'Teacher' : studentName}
        />
      )}
    </div>
  );
}
