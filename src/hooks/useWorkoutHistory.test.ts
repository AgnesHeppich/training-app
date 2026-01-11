
import { renderHook, act } from '@testing-library/react';
import { useWorkoutHistory } from './useWorkoutHistory';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Helper to clear localStorage before each test
beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

describe('useWorkoutHistory', () => {
    it('should save data and retrieve it as a suggestion in later sessions', () => {
        const { result } = renderHook(() => useWorkoutHistory());

        // Wait for the hook to "load" (though in tests it's sync or quick)
        // We can check isLoaded if we want to be safe

        const exerciseName = "Assisted Pull-ups (band)";
        const workout1Id = "w1-d1";
        const workout2Id = "w1-d4"; // Happens after w1-d1 in PROGRAM

        const log1 = {
            [exerciseName]: [
                { weight: "10", reps: "8" },
                { weight: "10", reps: "7" }
            ]
        };

        // 1. Data is added to the exercise during the session
        act(() => {
            result.current.saveWorkoutLog(workout1Id, log1, true);
        });

        // 2. if the exercise same exercise shows up again later in the program 
        // the number of reps and sets from last session is shown as a suggestion
        const suggestions = result.current.getPreviousStats(exerciseName, workout2Id);
        expect(suggestions).toEqual(log1[exerciseName]);
    });

    it('should preserve old data while using new data for future suggestions', () => {
        const { result } = renderHook(() => useWorkoutHistory());

        const exerciseName = "Assisted Pull-ups (band)";
        const workout1Id = "w1-d1";
        const workout2Id = "w1-d4";
        const workout3Id = "w2-d1"; // Happens after w1-d4

        const log1 = {
            [exerciseName]: [{ weight: "10", reps: "8" }]
        };

        const log2 = {
            [exerciseName]: [{ weight: "15", reps: "5" }]
        };

        // Save first session
        act(() => {
            result.current.saveWorkoutLog(workout1Id, log1, true);
        });

        // Verify workout 2 gets suggestions from workout 1
        const suggestionsFor2 = result.current.getPreviousStats(exerciseName, workout2Id);
        expect(suggestionsFor2).toEqual(log1[exerciseName]);

        // 3. when you enter new data on the second time you make the exercise, 
        // the initial session will remain with the old data
        act(() => {
            result.current.saveWorkoutLog(workout2Id, log2, true);
        });

        const savedLog1 = result.current.getLogForWorkout(workout1Id);
        expect(savedLog1?.[exerciseName]).toEqual(log1[exerciseName]);

        const savedLog2 = result.current.getLogForWorkout(workout2Id);
        expect(savedLog2?.[exerciseName]).toEqual(log2[exerciseName]);

        // 4. the newest data (from this current session) is used as a suggestion 
        // next time the exercise shows up in the program
        const suggestionsFor3 = result.current.getPreviousStats(exerciseName, workout3Id);
        expect(suggestionsFor3).toEqual(log2[exerciseName]);
    });

    it('should not show suggestions from future sessions when viewing an old session', () => {
        const { result } = renderHook(() => useWorkoutHistory());

        const exerciseName = "Assisted Pull-ups (band)";
        const workout1Id = "w1-d1";
        const workout2Id = "w1-d4";

        const log2 = {
            [exerciseName]: [{ weight: "20", reps: "5" }]
        };

        // Save data for a "future" session (e.g. user goes back to edit)
        act(() => {
            result.current.saveWorkoutLog(workout2Id, log2, true);
        });

        // On an earlier session, suggestions should be empty/null if nothing occurred before it
        const suggestionsFor1 = result.current.getPreviousStats(exerciseName, workout1Id);
        expect(suggestionsFor1).toBeNull();
    });
});
