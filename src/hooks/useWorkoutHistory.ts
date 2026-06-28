'use client';

import { useState, useEffect } from 'react';
import { PROGRAM, WorkoutDay } from '@/data/program';
import { isPullUpExercise, isCardioExercise, parseRepTarget, ExerciseLogType } from '@/lib/repsUtils';

export type { ExerciseLogType };

export type SetLog = {
    weight: string;
    reps: string;
};

export type WorkoutLog = {
    [exerciseName: string]: SetLog[];
};

export type ExerciseLogTypes = {
    [exerciseName: string]: ExerciseLogType;
};

export type CompletedWorkout = {
    id: string;
    completedAt: string;
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

export type ExerciseProgressMetric = 'weight' | 'reps' | 'cardio';

export type ExerciseSessionPoint = {
    workoutId: string;
    week: number;
    dayLabel: string;
    completedAt: string;
    totalReps: number | null;
    maxReps: number | null;
    avgReps: number | null;
    maxWeight: number | null;
    totalVolume: number | null;
    cardioValue: number | null;
    sets: SetLog[];
};

export type ExerciseProgressSeries = {
    name: string;
    metric: ExerciseProgressMetric;
    target: string;
    points: ExerciseSessionPoint[];
};

type HistoryData = {
    completedWorkouts: CompletedWorkout[];
    logs: { [workoutId: string]: WorkoutLog };
    notes: { [workoutId: string]: { [exerciseName: string]: string } };
    logTypes: { [workoutId: string]: ExerciseLogTypes };
};

const EMPTY: HistoryData = { completedWorkouts: [], logs: {}, notes: {}, logTypes: {} };

export function useWorkoutHistory(program: WorkoutDay[] = PROGRAM, programId: number | null = null) {
    const [data, setData] = useState<HistoryData>(EMPTY);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const url = programId ? `/api/history?programId=${programId}` : '/api/history';
                const res = await fetch(url);
                const dbData = await res.json();
                // Normalise: handle both old string[] and new {id, completedAt}[] shapes
                const raw = dbData.completedWorkouts ?? [];
                const completedWorkouts: CompletedWorkout[] = raw.map((entry: unknown) =>
                    typeof entry === 'string'
                        ? { id: entry, completedAt: new Date().toISOString() }
                        : (entry as CompletedWorkout)
                );
                setData({
                    completedWorkouts,
                    logs: dbData.logs ?? {},
                    notes: dbData.notes ?? {},
                    logTypes: dbData.logTypes ?? {},
                });
            } catch (e) {
                console.error('Failed to load workout history', e);
            }
            setIsLoaded(true);
        })();
    // Page reloads on program switch, so programId is stable for the lifetime of this hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveHistory = (newData: HistoryData) => {
        setData(newData);
        if (!programId) {
            console.warn('Cannot persist history: programId not yet available');
            return;
        }
        fetch('/api/history', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ programId, ...newData }),
        }).catch(e => console.error('Failed to save workout history', e));
    };

    // Flat list of IDs for quick .includes() checks
    const completedWorkoutIds = data.completedWorkouts.map(w => w.id);

    const getPreviousStats = (exerciseName: string, currentWorkoutId?: string): SetLog[] | null => {
        if (currentWorkoutId) {
            const currentIndex = program.findIndex(w => w.id === currentWorkoutId);
            if (currentIndex > 0) {
                for (const day of program.slice(0, currentIndex).reverse()) {
                    if (!completedWorkoutIds.includes(day.id)) continue;
                    const dayLog = data.logs[day.id];
                    if (dayLog?.[exerciseName]?.some(s => s.weight !== '' || s.reps !== '')) {
                        return dayLog[exerciseName];
                    }
                }
            }
            return null;
        }
        for (const day of [...program].reverse()) {
            if (!completedWorkoutIds.includes(day.id)) continue;
            const dayLog = data.logs[day.id];
            if (dayLog?.[exerciseName]?.some(s => s.weight !== '' || s.reps !== '')) {
                return dayLog[exerciseName];
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

        const currentIndex = program.findIndex(w => w.id === currentWorkoutId);
        if (currentIndex <= 0) return { adaptedReps: programTarget, isAdapted: false };

        const sessionAverages: number[] = [];
        for (const day of program.slice(0, currentIndex).reverse()) {
            if (sessionAverages.length >= 3) break;
            if (!completedWorkoutIds.includes(day.id)) continue;
            const repNums = (data.logs[day.id]?.[exerciseName] ?? [])
                .map(s => parseInt(s.reps))
                .filter(n => !isNaN(n) && n > 0);
            if (repNums.length > 0)
                sessionAverages.push(repNums.reduce((a, b) => a + b, 0) / repNums.length);
        }

        if (sessionAverages.length === 0)
            return { adaptedReps: programTarget, isAdapted: false };

        const overallAvg = sessionAverages.reduce((a, b) => a + b, 0) / sessionAverages.length;
        if (overallAvg / numericTarget < 0.75) {
            const roundedAvg = Math.max(1, Math.round(overallAvg));
            return {
                adaptedReps: String(roundedAvg),
                isAdapted: true,
                reason: `Lowered from ${programTarget} reps — you averaged ${roundedAvg} in recent sessions`,
            };
        }
        return { adaptedReps: programTarget, isAdapted: false };
    };

    const getPerformanceSummary = (): PerformanceSummary => {
        const completedDays = program.filter(d => completedWorkoutIds.includes(d.id));
        const performanceTrend = completedDays.flatMap(day => {
            const dayLog = data.logs[day.id];
            if (!dayLog) return [];
            return day.exercises.filter(ex => !ex.isWarmup).map(ex => {
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
                return { workoutId: day.id, week: day.week, exerciseName: ex.name, programTarget: ex.reps, avgReps, avgWeight };
            });
        });
        return { totalCompleted: data.completedWorkouts.length, totalInProgram: program.length, performanceTrend };
    };

    const getLastSessions = (limit = 10) => {
        const completedInOrder = program.filter(d => completedWorkoutIds.includes(d.id));
        if (completedInOrder.length === 0) return null;
        return completedInOrder.slice(-limit).map(day => ({
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
        const lastCompletedIndex = program.reduce(
            (last, day, idx) => (completedWorkoutIds.includes(day.id) ? idx : last),
            -1
        );
        return program
            .slice(lastCompletedIndex + 1)
            .filter(d => !completedWorkoutIds.includes(d.id))
            .slice(0, limit)
            .map(day => ({
                id: day.id,
                week: day.week,
                dayLabel: day.dayLabel,
                title: day.title,
                exercises: day.exercises.map(ex => ({ name: ex.name, programSets: ex.sets, programTarget: ex.reps })),
            }));
    };

    const getLogTypesForWorkout = (workoutId: string): ExerciseLogTypes | null =>
        data.logTypes[workoutId] || null;

    const getExerciseLogType = (
        exerciseName: string,
        programTarget: string,
        currentWorkoutId: string
    ): ExerciseLogType => {
        const saved = data.logTypes[currentWorkoutId]?.[exerciseName];
        if (saved) return saved;

        const currentIndex = program.findIndex(w => w.id === currentWorkoutId);
        if (currentIndex > 0) {
            for (const day of program.slice(0, currentIndex).reverse()) {
                if (!completedWorkoutIds.includes(day.id)) continue;
                const prevType = data.logTypes[day.id]?.[exerciseName];
                if (prevType) return prevType;
            }
        }

        return isCardioExercise(exerciseName, programTarget) ? 'cardio' : 'strength';
    };

    const getPreviousLogType = (
        exerciseName: string,
        currentWorkoutId: string
    ): ExerciseLogType | null => {
        const currentIndex = program.findIndex(w => w.id === currentWorkoutId);
        if (currentIndex <= 0) return null;

        for (const day of program.slice(0, currentIndex).reverse()) {
            if (!completedWorkoutIds.includes(day.id)) continue;
            const dayLog = data.logs[day.id]?.[exerciseName];
            if (!dayLog?.some(s => s.weight !== '' || s.reps !== '')) continue;

            const savedType = data.logTypes[day.id]?.[exerciseName];
            if (savedType) return savedType;

            const ex = day.exercises.find(e => e.name === exerciseName);
            return isCardioExercise(exerciseName, ex?.reps) ? 'cardio' : 'strength';
        }
        return null;
    };

    const getLogForWorkout = (workoutId: string): WorkoutLog | null => data.logs[workoutId] || null;

    const getNotesForWorkout = (workoutId: string) => data.notes[workoutId] || null;

    const getPreviousNote = (exerciseName: string, currentWorkoutId: string): string | null => {
        const currentIndex = program.findIndex(w => w.id === currentWorkoutId);
        if (currentIndex <= 0) return null;
        for (const day of program.slice(0, currentIndex).reverse()) {
            if (!completedWorkoutIds.includes(day.id)) continue;
            const note = data.notes[day.id]?.[exerciseName];
            if (note) return note;
        }
        return null;
    };

    const isWorkoutCompleted = (workoutId: string) => completedWorkoutIds.includes(workoutId);

    const saveWorkoutLog = (
        workoutId: string,
        log: WorkoutLog,
        markComplete = true,
        exerciseNotes?: { [exerciseName: string]: string },
        exerciseLogTypes?: ExerciseLogTypes
    ) => {
        const newData: HistoryData = { ...data, logs: { ...data.logs, [workoutId]: log } };

        if (exerciseNotes) {
            newData.notes = { ...newData.notes, [workoutId]: exerciseNotes };
        }

        if (exerciseLogTypes) {
            newData.logTypes = { ...newData.logTypes, [workoutId]: exerciseLogTypes };
        }

        if (markComplete && !completedWorkoutIds.includes(workoutId)) {
            newData.completedWorkouts = [
                ...data.completedWorkouts,
                { id: workoutId, completedAt: new Date().toISOString() },
            ];
        }

        saveHistory(newData);
    };

    const getExerciseProgress = (): ExerciseProgressSeries[] => {
        // Unique non-warmup exercises, in the order they first appear in the program.
        const order: string[] = [];
        const targetByName: { [name: string]: string } = {};
        for (const day of program) {
            for (const ex of day.exercises) {
                if (ex.isWarmup) continue;
                if (!(ex.name in targetByName)) order.push(ex.name);
                targetByName[ex.name] = ex.reps; // keep latest program target
            }
        }

        const completedAtById = new Map(data.completedWorkouts.map(w => [w.id, w.completedAt]));
        // Include every program day that has logged data — not just ones marked
        // "complete" — so history saved by older app versions still shows up.
        const loggedDays = program.filter(d => data.logs[d.id]);

        return order.map(name => {
            const points: ExerciseSessionPoint[] = [];
            let anyWeight = false;
            let anyCardio = false;

            for (const day of loggedDays) {
                const ex = day.exercises.find(e => e.name === name);
                if (!ex) continue;
                const sets = data.logs[day.id]?.[name];
                if (!sets || !sets.some(s => s.weight !== '' || s.reps !== '')) continue;

                const logType =
                    data.logTypes[day.id]?.[name] ??
                    (isCardioExercise(name, ex.reps) ? 'cardio' : 'strength');

                const repNums = sets.map(s => parseInt(s.reps)).filter(n => !isNaN(n) && n > 0);
                const weightNums = sets.map(s => parseFloat(s.weight)).filter(n => !isNaN(n) && n > 0);

                if (weightNums.length > 0) anyWeight = true;
                if (logType === 'cardio') anyCardio = true;

                const totalReps = repNums.length ? repNums.reduce((a, b) => a + b, 0) : null;
                const maxReps = repNums.length ? Math.max(...repNums) : null;
                const avgReps = repNums.length
                    ? Math.round((repNums.reduce((a, b) => a + b, 0) / repNums.length) * 10) / 10
                    : null;
                const maxWeight = weightNums.length ? Math.max(...weightNums) : null;

                let totalVolume: number | null = null;
                for (const s of sets) {
                    const w = parseFloat(s.weight);
                    const r = parseInt(s.reps);
                    if (!isNaN(w) && !isNaN(r) && w > 0 && r > 0) totalVolume = (totalVolume ?? 0) + w * r;
                }

                // For cardio the value (time/distance) is entered in the weight field.
                const cardioValue = weightNums.length ? Math.max(...weightNums) : null;

                points.push({
                    workoutId: day.id,
                    week: day.week,
                    dayLabel: day.dayLabel,
                    completedAt: completedAtById.get(day.id) ?? '',
                    totalReps,
                    maxReps,
                    avgReps,
                    maxWeight,
                    totalVolume,
                    cardioValue,
                    sets: sets.map(s => ({ weight: s.weight, reps: s.reps })),
                });
            }

            const metric: ExerciseProgressMetric = anyCardio ? 'cardio' : anyWeight ? 'weight' : 'reps';
            return { name, metric, target: targetByName[name], points };
        });
    };

    const getOverallProgress = () => {
        if (program.length === 0) return 0;
        return Math.min(100, Math.round((data.completedWorkouts.length / program.length) * 100));
    };

    return {
        isLoaded,
        completedWorkouts: data.completedWorkouts,  // {id, completedAt}[] — full shape with timestamps
        completedWorkoutIds,                         // string[] — for .includes() checks
        getPreviousStats,
        getPreviousNote,
        getAdaptedTarget,
        getPerformanceSummary,
        getLastSessions,
        getUpcomingSessions,
        getLogForWorkout,
        getLogTypesForWorkout,
        getExerciseLogType,
        getPreviousLogType,
        getNotesForWorkout,
        isWorkoutCompleted,
        saveWorkoutLog,
        getOverallProgress,
        getExerciseProgress,
    };
}
