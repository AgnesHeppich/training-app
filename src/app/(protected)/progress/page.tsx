'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { NavMenu } from '@/components/NavMenu';
import { ProgramMastery } from '@/components/ProgramMastery';
import { ExerciseProgress } from '@/components/ExerciseProgress';
import { useWorkoutData } from '@/contexts/WorkoutDataContext';

export default function ProgressPage() {
    const { getEffectiveProgram, isLoaded, activeProgramId, completedWorkoutIds, allPrograms, getExerciseProgress, progressPriorities, setProgressPriorities } = useWorkoutData();
    const effectiveProgram = getEffectiveProgram();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center text-green-600 font-bold text-xl animate-pulse">
                Loading...
            </div>
        );
    }

    if (!activeProgramId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
                <NavMenu />
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">No program selected</h1>
                <p className="text-gray-500 text-sm">Pick a program to see your progress.</p>
                <Link
                    href="/programs"
                    className="px-6 py-3 rounded-2xl bg-green-600 text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-colors"
                >
                    Browse Programs
                </Link>
            </div>
        );
    }

    const allWeeks = Array.from(new Set(effectiveProgram.map(d => d.week))).sort((a, b) => a - b);
    const activeProgram = allPrograms.find(p => p.id === activeProgramId);
    const programName = activeProgram?.name ?? 'Workout Buddy';
    const weeksMastered = allWeeks.filter(w =>
        effectiveProgram.filter(d => d.week === w).every(d => completedWorkoutIds.includes(d.id))
    ).length;
    const exerciseProgress = getExerciseProgress();

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/"
                        className="text-xs text-gray-500 hover:text-green-700 transition-colors font-bold uppercase tracking-widest"
                    >
                        ← Home
                    </Link>
                    <NavMenu />
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Progress</h1>
                <p className="text-gray-500 text-sm font-medium">{programName}</p>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <ProgramMastery
                    completedSessions={completedWorkoutIds.length}
                    totalSessions={effectiveProgram.length}
                    weeksMastered={weeksMastered}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
            >
                <ExerciseProgress
                    series={exerciseProgress}
                    progressPriorities={progressPriorities}
                    onProgressPrioritiesChange={setProgressPriorities}
                />
            </motion.div>
        </div>
    );
}
