'use client';

import { createContext, useContext } from 'react';
import { useProgram } from '@/hooks/useProgram';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';

type ProgramHook = ReturnType<typeof useProgram>;
type HistoryHook = ReturnType<typeof useWorkoutHistory>;

type WorkoutDataContextType = Omit<ProgramHook, 'isLoaded'> &
    Omit<HistoryHook, 'isLoaded'> & {
        programLoaded: boolean;
        historyLoaded: boolean;
        isLoaded: boolean;
    };

const WorkoutDataContext = createContext<WorkoutDataContextType | null>(null);

export function WorkoutDataProvider({ children }: { children: React.ReactNode }) {
    const { isLoaded: programLoaded, ...programRest } = useProgram();
    const effectiveProgram = programRest.getEffectiveProgram();
    const { isLoaded: historyLoaded, ...historyRest } = useWorkoutHistory(
        effectiveProgram,
        programRest.activeProgramId
    );

    return (
        <WorkoutDataContext.Provider value={{
            ...programRest,
            ...historyRest,
            programLoaded,
            historyLoaded,
            isLoaded: programLoaded && historyLoaded,
        }}>
            {children}
        </WorkoutDataContext.Provider>
    );
}

export function useWorkoutData(): WorkoutDataContextType {
    const ctx = useContext(WorkoutDataContext);
    if (!ctx) throw new Error('useWorkoutData must be used within WorkoutDataProvider');
    return ctx;
}
