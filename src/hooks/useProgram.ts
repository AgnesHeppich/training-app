'use client';

import { useState, useEffect } from 'react';
import { PROGRAM, WorkoutDay } from '@/data/program';
import { ProgramUpdate } from '@/lib/analysisSchema';

export type ProgramMeta = {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    workout_count: number;
};

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
    const [baseProgram, setBaseProgram] = useState<WorkoutDay[]>(PROGRAM);
    const [storedUpdates, setStoredUpdates] = useState<StoredUpdates>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [allPrograms, setAllPrograms] = useState<ProgramMeta[]>([]);
    const [activeProgramId, setActiveProgramId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [programRes, overridesRes, programsRes] = await Promise.all([
                    fetch('/api/programs/active'),
                    fetch('/api/program'),
                    fetch('/api/programs'),
                ]);
                const programData = await programRes.json();
                const overridesData = await overridesRes.json();
                const programsData: ProgramMeta[] = await programsRes.json();

                if (programData.workouts?.length > 0) {
                    setBaseProgram(programData.workouts);
                }
                if (programData.id) {
                    setActiveProgramId(programData.id);
                }
                if (overridesData.overrides) {
                    setStoredUpdates(overridesData.overrides);
                }
                setAllPrograms(programsData);
            } catch (e) {
                console.error('Failed to load program updates', e);
            }
            setIsLoaded(true);
        })();
    }, []);

    const getEffectiveProgram = (): WorkoutDay[] => {
        if (Object.keys(storedUpdates).length === 0) return baseProgram;

        return baseProgram.map(day => {
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
        fetch('/api/program', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ programId: activeProgramId, overrides: newStoredUpdates }),
        }).catch(e => console.error('Failed to save program updates', e));
    };

    const switchProgram = async (programId: number) => {
        await fetch('/api/programs/active', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ programId }),
        });
        window.location.reload();
    };

    const hasStoredUpdates = Object.keys(storedUpdates).length > 0;

    const isAICoachUpdated = (workoutId: string, exerciseName: string): boolean => {
        return !!(storedUpdates[workoutId]?.[exerciseName]);
    };

    return {
        isLoaded,
        getEffectiveProgram,
        applyUpdates,
        hasStoredUpdates,
        isAICoachUpdated,
        allPrograms,
        activeProgramId,
        switchProgram,
    };
}
