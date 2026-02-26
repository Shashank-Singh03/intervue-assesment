import { useState, useEffect, useRef } from 'react';

export function usePollTimer(startTime, duration) {
    const [remaining, setRemaining] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!startTime || !duration) {
            setRemaining(0);
            return;
        }

        function tick() {
            const elapsed = Date.now() - startTime;
            const totalMs = duration * 1000;
            const left = Math.max(0, totalMs - elapsed);
            setRemaining(left);

            if (left <= 0 && intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        tick();
        intervalRef.current = setInterval(tick, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startTime, duration]);

    const totalSeconds = Math.ceil(remaining / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    return {
        remaining,
        formatted: `${minutes}:${seconds}`,
        isExpired: remaining <= 0,
    };
}
