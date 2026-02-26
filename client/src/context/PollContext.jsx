import { createContext, useContext, useReducer } from 'react';

const PollContext = createContext(null);

const initialState = {
    role: null,           // 'student' | 'teacher'
    studentName: '',
    activePoll: null,
    results: null,
    participants: [],
    hasVoted: false,
    selectedOption: null,
    error: null,
};

function pollReducer(state, action) {
    switch (action.type) {
        case 'SET_ROLE':
            return { ...state, role: action.payload };
        case 'SET_STUDENT_NAME':
            return { ...state, studentName: action.payload };
        case 'SET_ACTIVE_POLL':
            return { ...state, activePoll: action.payload, results: null, hasVoted: false, selectedOption: null };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        case 'SET_PARTICIPANTS':
            return { ...state, participants: action.payload };
        case 'SET_HAS_VOTED':
            return { ...state, hasVoted: true, selectedOption: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'POLL_ENDED':
            return { ...state, activePoll: null, results: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export function PollProvider({ children }) {
    const [state, dispatch] = useReducer(pollReducer, initialState);
    return (
        <PollContext.Provider value={{ state, dispatch }}>
            {children}
        </PollContext.Provider>
    );
}

export function usePollContext() {
    const ctx = useContext(PollContext);
    if (!ctx) throw new Error('usePollContext must be used within PollProvider');
    return ctx;
}
