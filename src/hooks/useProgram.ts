'use client';

import { useState, useEffect } from 'react';
import { PROGRAM, WorkoutDay } from '@/data/program';
import { ProgramUpdate } from '@/lib/analysisSchema';

const PROGRAM_STORAGE_KEY = 'pullup-mastery-program';

type ExerciseOverride = {
    reps?: string;
    sets?: number;
};

type StoredUpdates = {
    [workoutId: string]: {
        [exerciseName: string]: ExerciseOverride;
    };
};

export function useProgram() {
    const [storedUpdates, setStoredUpdates] = useState<StoredUpdates>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(PROGRAM_STORAGE_KEY);
        if (stored) {
            try {
                setStoredUpdates(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse program updates', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const getEffectiveProgram = (): WorkoutDay[] => {
        if (Object.keys(storedUpdates).length === 0) return PROGRAM;

        return PROGRAM.map(day => {
            const dayUpdates = storedUpdates[day.id];
            if (!dayUpdates) return day;

            return {
                ...day,
                exercises: day.exercises.map(ex => {
                    const override = dayUpdates[ex.name];
                    if (!override) return ex;
                    return { ...ex, ...override };
                }),
            };
        });
    };

    const applyUpdates = (updates: ProgramUpdate[]) => {
        const newStoredUpdates: StoredUpdates = JSON.parse(JSON.stringify(storedUpdates));

        for (const update of updates) {
            if (!newStoredUpdates[update.workoutId]) {
                newStoredUpdates[update.workoutId] = {};
            }
            if (!newStoredUpdates[update.workoutId][update.exerciseName]) {
                newStoredUpdates[update.workoutId][update.exerciseName] = {};
            }

            if (update.field === 'reps') {
                newStoredUpdates[update.workoutId][update.exerciseName].reps = update.suggestedValue;
            } else if (update.field === 'sets') {
                const parsed = parseInt(update.suggestedValue);
                if (!isNaN(parsed)) {
                    newStoredUpdates[update.workoutId][update.exerciseName].sets = parsed;
                }
            }
        }

        setStoredUpdates(newStoredUpdates);
        localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(newStoredUpdates));
    };

    const hasStoredUpdates = Object.keys(storedUpdates).length > 0;

    return {
        isLoaded,
        getEffectiveProgram,
        applyUpdates,
        hasStoredUpdates,
    };
}
