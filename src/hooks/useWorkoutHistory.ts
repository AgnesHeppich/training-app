'use client';

import { useState, useEffect } from 'react';
import { PROGRAM } from '@/data/program';
import { isPullUpExercise, parseRepTarget } from '@/lib/repsUtils';

export type SetLog = {
    weight: string;
    reps: string;
};

export type WorkoutLog = {
    [exerciseName: string]: SetLog[];
};

export type AdaptedTarget = {
    adaptedReps: string;
    isAdapted: boolean;
    reason?: string;
};

export type PerformanceSummary = {
    totalCompleted: number;
    totalInProgram: number;
    performanceTrend: Array<{
        workoutId: string;
        week: number;
        exerciseName: string;
        programTarget: string;
        avgReps: number | null;
        avgWeight: number | null;
    }>;
};

type HistoryData = {
    completedWorkouts: string[];
    logs: { [workoutId: string]: WorkoutLog };
    notes: { [workoutId: string]: { [exerciseName: string]: string } };
};

const STORAGE_KEY = 'pullup-mastery-data';

export function useWorkoutHistory() {
    const [data, setData] = useState<HistoryData>({
        completedWorkouts: [],
        logs: {},
        notes: {}
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
                    logs: parsed.logs || {},
                    notes: parsed.notes || {}
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

    const getPreviousStats = (exerciseName: string, currentWorkoutId?: string): SetLog[] | null => {
        if (currentWorkoutId) {
            const currentIndex = PROGRAM.findIndex(w => w.id === currentWorkoutId);
            if (currentIndex > 0) {
                const priorWorkouts = PROGRAM.slice(0, currentIndex).reverse();
                for (const day of priorWorkouts) {
                    const dayLog = data.logs[day.id];
                    if (dayLog && dayLog[exerciseName]) {
                        const hasData = dayLog[exerciseName].some(s => s.weight !== "" || s.reps !== "");
                        if (hasData) return dayLog[exerciseName];
                    }
                }
            }
            return null;
        }

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

    const getAdaptedTarget = (
        exerciseName: string,
        programTarget: string,
        currentWorkoutId: string
    ): AdaptedTarget => {
        if (!isPullUpExercise(exerciseName))
            return { adaptedReps: programTarget, isAdapted: false };

        const numericTarget = parseRepTarget(programTarget);
        if (numericTarget === null)
            return { adaptedReps: programTarget, isAdapted: false };

        const currentIndex = PROGRAM.findIndex(w => w.id === currentWorkoutId);
        if (currentIndex <= 0) return { adaptedReps: programTarget, isAdapted: false };

        const priorWorkouts = PROGRAM.slice(0, currentIndex).reverse();
        const sessionAverages: number[] = [];

        for (const day of priorWorkouts) {
            if (sessionAverages.length >= 3) break;
            const dayLog = data.logs[day.id];
            if (!dayLog?.[exerciseName]) continue;
            const repNums = dayLog[exerciseName]
                .map(s => parseInt(s.reps))
                .filter(n => !isNaN(n) && n > 0);
            if (repNums.length === 0) continue;
            sessionAverages.push(repNums.reduce((a, b) => a + b, 0) / repNums.length);
        }

        if (sessionAverages.length === 0)
            return { adaptedReps: programTarget, isAdapted: false };

        const overallAvg = sessionAverages.reduce((a, b) => a + b, 0) / sessionAverages.length;
        const ratio = overallAvg / numericTarget;

        if (ratio < 0.75) {
            return {
                adaptedReps: String(Math.max(1, Math.round(overallAvg))),
                isAdapted: true,
                reason: "Adjusted to match your recent performance"
            };
        }

        return { adaptedReps: programTarget, isAdapted: false };
    };

    const getPerformanceSummary = (): PerformanceSummary => {
        const completedDays = PROGRAM.filter(d =>
            data.completedWorkouts.includes(d.id)
        );

        const performanceTrend = completedDays.flatMap(day => {
            const dayLog = data.logs[day.id];
            if (!dayLog) return [];
            return day.exercises
                .filter(ex => !ex.isWarmup)
                .map(ex => {
                    const sets = dayLog[ex.name];
                    let avgReps: number | null = null;
                    let avgWeight: number | null = null;
                    if (sets) {
                        const repNums = sets.map(s => parseInt(s.reps)).filter(n => !isNaN(n) && n > 0);
                        if (repNums.length > 0)
                            avgReps = Math.round((repNums.reduce((a, b) => a + b, 0) / repNums.length) * 10) / 10;
                        const weightNums = sets.map(s => parseFloat(s.weight)).filter(n => !isNaN(n) && n > 0);
                        if (weightNums.length > 0)
                            avgWeight = Math.round((weightNums.reduce((a, b) => a + b, 0) / weightNums.length) * 10) / 10;
                    }
                    return {
                        workoutId: day.id,
                        week: day.week,
                        exerciseName: ex.name,
                        programTarget: ex.reps,
                        avgReps,
                        avgWeight
                    };
                });
        });

        return {
            totalCompleted: data.completedWorkouts.length,
            totalInProgram: PROGRAM.length,
            performanceTrend
        };
    };

    const getLastSessions = (limit = 10) => {
        const completedInOrder = PROGRAM.filter(d => data.completedWorkouts.includes(d.id));
        if (completedInOrder.length === 0) return null;

        const recent = completedInOrder.slice(-limit);
        return recent.map(day => ({
            id: day.id,
            week: day.week,
            dayLabel: day.dayLabel,
            title: day.title,
            exercises: day.exercises.map(ex => {
                const log = data.logs[day.id]?.[ex.name] ?? [];
                return {
                    name: ex.name,
                    programSets: ex.sets,
                    programTarget: ex.reps,
                    actualSets: log.map(s => ({ weight: s.weight || '—', reps: s.reps || '—' })),
                };
            }),
        }));
    };

    const getUpcomingSessions = (limit = 10) => {
        const lastCompletedIndex = PROGRAM.reduce(
            (last, day, idx) => (data.completedWorkouts.includes(day.id) ? idx : last),
            -1
        );
        const upcoming = PROGRAM.slice(lastCompletedIndex + 1).filter(
            d => !data.completedWorkouts.includes(d.id)
        );
        return upcoming.slice(0, limit).map(day => ({
            id: day.id,
            week: day.week,
            dayLabel: day.dayLabel,
            title: day.title,
            exercises: day.exercises.map(ex => ({
                name: ex.name,
                programSets: ex.sets,
                programTarget: ex.reps,
            })),
        }));
    };

    const getLogForWorkout = (workoutId: string): WorkoutLog | null => {
        return data.logs[workoutId] || null;
    };

    const getNotesForWorkout = (workoutId: string): { [exerciseName: string]: string } | null => {
        return data.notes[workoutId] || null;
    };

    const getPreviousNote = (exerciseName: string, currentWorkoutId: string): string | null => {
        const currentIndex = PROGRAM.findIndex(w => w.id === currentWorkoutId);
        if (currentIndex <= 0) return null;
        const priorWorkouts = PROGRAM.slice(0, currentIndex).reverse();
        for (const day of priorWorkouts) {
            const note = data.notes[day.id]?.[exerciseName];
            if (note) return note;
        }
        return null;
    };

    const isWorkoutCompleted = (workoutId: string) => {
        return data.completedWorkouts.includes(workoutId);
    };

    const saveWorkoutLog = (workoutId: string, log: WorkoutLog, markComplete: boolean = true, exerciseNotes?: { [exerciseName: string]: string }) => {
        const newData = { ...data };
        newData.logs[workoutId] = log;

        if (exerciseNotes) {
            newData.notes = { ...newData.notes, [workoutId]: exerciseNotes };
        }

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
        getPreviousNote,
        getAdaptedTarget,
        getPerformanceSummary,
        getLastSessions,
        getUpcomingSessions,
        getLogForWorkout,
        getNotesForWorkout,
        isWorkoutCompleted,
        saveWorkoutLog,
        getOverallProgress
    };
}
