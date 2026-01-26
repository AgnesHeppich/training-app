'use client';

import { useState, useEffect } from 'react';
import { PROGRAM } from '@/data/program';

export type SetLog = {
    weight: string;
    reps: string;
};

export type WorkoutLog = {
    [exerciseName: string]: SetLog[];
};

type HistoryData = {
    completedWorkouts: string[];
    logs: { [workoutId: string]: WorkoutLog };
};

const STORAGE_KEY = 'pullup-mastery-data';

export function useWorkoutHistory() {
    const [data, setData] = useState<HistoryData>({
        completedWorkouts: [],
        logs: {}
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Migration: If old format with lastPerformed exists, just ignore/strip it
                setData({
                    completedWorkouts: parsed.completedWorkouts || [],
                    logs: parsed.logs || {}
                });
            } catch (e) {
                console.error("Failed to parse workout history", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const saveHistory = (newData: HistoryData) => {
        setData(newData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    };

    // Find the "latest" performed data for an exercise based on the program order
    // relative to the current workout (we want previous relative to NOW, or absolute latest?)
    // Prompt: "latest data as recommendations for the NEXT session".
    // Usually this means "The most recent session I did".
    // If I am doing W4D1, I want to see what I did in W3D1 (or whenever I last did logs).
    // So we scan backwards from *current* workout index? Or just absolute latest?
    // User: "Note that I only want to save the updated reps/weights on the latest workout session"
    // ... "I always want to use the latest data as recommendations".
    // If I am viewing W1D1 (old), I probably want to see what I did *Before* W1D1? No, that's empty.
    // If I am viewing W4D1, and I edited W1D1 yesterday. I want to see W3D1 stats, not W1D1.
    // So yes, strictly "Previous relative to this workout" logic?
    // OR "Absolute latest data available in the system"?
    // "recommendations for the next session" -> usually means "Last time I did THIS exercise".
    // Let's assume absolute latest for now, unless we are in the context of a specific workout.
    // Actually, usually suggestions are "What did I do last time?".
    // If I open W1D1 (past), show me what I did IN W1D1 (logs) or empty?
    // `getPreviousStats` is used for "Last Time: ..." display.
    // On W1D1 page, it should probably show nothing (since it's the start).
    // On W1D4 page, it should show W1D1 stats.
    // So we need `getPreviousStats(exerciseName, currentWorkoutId)`.
    // If `currentWorkoutId` is not provided, we return absolute latest.

    // Wait, `ExerciseItem` calls `getPreviousStats(exercise.name)`. It doesn't pass ID.
    // I should update `ExerciseItem` to not need ID? 
    // Or update `WorkoutPage` to pass the correct stats.
    // In `WorkoutPage`: `history={getPreviousStats(exercise.name) || undefined}`.
    // I should change `getPreviousStats` to take `currentWorkoutId`.

    const getPreviousStats = (exerciseName: string, currentWorkoutId?: string): SetLog[] | null => {
        let searchWorkouts = PROGRAM;

        // If we have a current reference, we only look at workouts BEFORE this one
        // to find the "previous" session for THIS day's context.
        if (currentWorkoutId) {
            const currentIndex = PROGRAM.findIndex(w => w.id === currentWorkoutId);
            if (currentIndex > 0) {
                // Check workouts before this one in reverse order
                // Slice 0 to currentIndex, then reverse
                const priorWorkouts = PROGRAM.slice(0, currentIndex).reverse();
                for (const day of priorWorkouts) {
                    const dayLog = data.logs[day.id];
                    if (dayLog && dayLog[exerciseName]) {
                        // Check if it has actual data
                        const hasData = dayLog[exerciseName].some(s => s.weight !== "" || s.reps !== "");
                        if (hasData) return dayLog[exerciseName];
                    }
                }
            }
            return null; // No previous history found before this workout
        }

        // If no context (absolute latest), scan from end reverse
        const allReverse = [...PROGRAM].reverse();
        for (const day of allReverse) {
            const dayLog = data.logs[day.id];
            if (dayLog && dayLog[exerciseName]) {
                const hasData = dayLog[exerciseName].some(s => s.weight !== "" || s.reps !== "");
                if (hasData) return dayLog[exerciseName];
            }
        }
        return null;
    };

    const getLogForWorkout = (workoutId: string): WorkoutLog | null => {
        return data.logs[workoutId] || null;
    };

    const isWorkoutCompleted = (workoutId: string) => {
        return data.completedWorkouts.includes(workoutId);
    };

    const saveWorkoutLog = (workoutId: string, log: WorkoutLog, markComplete: boolean = true) => {
        const newData = { ...data };

        // Save the log for this specific workout
        // We do NOT update a separate 'lastPerformed' cache anymore.
        // The source of truth is the log itself.
        newData.logs[workoutId] = log;

        if (markComplete && !newData.completedWorkouts.includes(workoutId)) {
            newData.completedWorkouts.push(workoutId);
        }

        saveHistory(newData);
    };

    const getOverallProgress = () => {
        const total = PROGRAM.length;
        const completed = data.completedWorkouts.length;
        return Math.min(100, Math.round((completed / total) * 100));
    };

    return {
        isLoaded,
        completedWorkouts: data.completedWorkouts,
        getPreviousStats,
        getLogForWorkout,
        isWorkoutCompleted,
        saveWorkoutLog,
        getOverallProgress
    };
}
