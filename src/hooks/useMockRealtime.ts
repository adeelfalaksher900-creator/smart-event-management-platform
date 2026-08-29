/**
 * @file useMockRealtime.ts
 * @description Single controlled realtime simulation layer.
 */
import { useEffect, useRef } from 'react';

export function useMockRealtime(
  callback: (event: { type: string; payload: any }) => void,
  intervalMs = 15000
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const events = [
      { type: 'NEW_ANNOUNCEMENT', payload: { title: 'Pizza is here!', content: 'Join us at the main hall for dinner.', type: 'info', author: 'Organizer System' } },
      { type: 'LEADERBOARD_SHIFT', payload: { teamId: 't1', scoreDelta: +2 } },
      { type: 'NEW_SUBMISSION', payload: { teamId: 't3', projectName: 'Data Sync V2' } },
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < events.length) {
        savedCallback.current(events[currentIndex]);
        currentIndex++;
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
}
