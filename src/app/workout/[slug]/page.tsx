'use client';

import { useParams, useRouter } from "next/navigation";
import { PROGRAM } from "@/data/program";
import { useWorkoutHistory, WorkoutLog } from "@/hooks/useWorkoutHistory";
import { ExerciseItem } from "@/components/ExerciseItem";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorkoutPage() {
    const params = useParams();
    const router = useRouter();
    const { isLoaded, getPreviousStats, saveWorkoutLog, completedWorkouts, getLogForWorkout } = useWorkoutHistory();
    const [currentLogs, setCurrentLogs] = useState<WorkoutLog>({});

    const workoutId = params.slug as string;
    const workout = PROGRAM.find(d => d.id === workoutId);
    const isMounted = useRef(false);

    // Initialize logs on load
    useEffect(() => {
        if (isLoaded && workoutId) {
            const existingLog = getLogForWorkout(workoutId);
            if (existingLog) {
                setCurrentLogs(existingLog);
            }
            isMounted.current = true;
        }
    }, [isLoaded, workoutId]); // Removing getLogForWorkout from dependency as it's stable-ish or could cause loops

    // Auto-save effect
    useEffect(() => {
        if (isMounted.current && workoutId && Object.keys(currentLogs).length > 0) {
            // Save without marking as complete
            saveWorkoutLog(workoutId, currentLogs, false);
        }
    }, [currentLogs, workoutId]);

    if (!isLoaded) return null;

    if (!workout) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl text-[#5c2b2b] mb-4">Workout not found</h1>
                <Link href="/" className="text-[#ff477e] hover:underline">Return Home</Link>
            </div>
        );
    }

    const handleFinish = () => {
        // Save AND mark complete
        saveWorkoutLog(workoutId, currentLogs, true);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff477e', '#ffffff', '#ff9eb5']
        });

        setTimeout(() => {
            router.push('/');
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <header className="mb-8">
                <Link href="/" className="text-sm text-[#8e5e5e] hover:text-[#ff477e] transition-colors mb-4 inline-block font-medium">
                    ← Back to Dashboard
                </Link>
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-sm text-[#ff477e] font-bold uppercase tracking-wider mb-1">
                            {workout.dayLabel} • Week {workout.week}
                        </h2>
                        <h1 className="text-4xl font-bold text-[#5c2b2b]">{workout.title}</h1>
                    </div>
                </div>
                <p className="mt-2 text-[#8e5e5e] border-l-4 border-[#ff477e] pl-4 italic bg-white/30 py-2 rounded-r-xl">
                    Focus: {workout.focus}
                </p>
            </header>

            <div className="space-y-4">
                {workout.exercises.map((exercise, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <ExerciseItem
                            exercise={exercise}
                            history={getPreviousStats(exercise.name, workoutId) || undefined}
                            initialLogs={currentLogs[exercise.name]}
                            onLogChange={(logs) => {
                                setCurrentLogs(prev => ({
                                    ...prev,
                                    [exercise.name]: logs
                                }));
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 mb-20 sticky bottom-6 z-20">
                <button
                    onClick={handleFinish}
                    className="w-full bg-gradient-to-r from-[#ff477e] to-[#ff9eb5] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Finish Workout
                </button>
            </div>
        </div>
    );
}
