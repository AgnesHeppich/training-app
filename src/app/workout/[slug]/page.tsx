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
    const [showButton, setShowButton] = useState(true);
    const lastScrollY = useRef(0);

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

    // Scroll direction detection for button visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
                // Scrolling down - hide button
                setShowButton(false);
            } else if (currentScrollY < lastScrollY.current) {
                // Scrolling up - show button
                setShowButton(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!isLoaded) return null;

    if (!workout) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl text-white mb-4 font-bold">Workout not found</h1>
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
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <header className="mb-12">
                <Link href="/" className="inline-flex items-center text-xs text-slate-500 hover:text-[#ff477e] transition-colors mb-8 font-bold uppercase tracking-widest">
                    <span className="mr-2 text-lg">←</span> Dashboard
                </Link>
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <h2 className="text-[10px] text-[#ff477e] font-black uppercase tracking-[0.2em] mb-2 px-1">
                            {workout.dayLabel} • Week {workout.week}
                        </h2>
                        <h1 className="text-5xl font-black text-white leading-tight tracking-tight">{workout.title}</h1>
                    </div>
                </div>
                <div className="mt-6 flex items-start gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60 shadow-inner">
                    <div className="w-1 h-full bg-[#ff477e] rounded-full" />
                    <div>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Workout Focus</span>
                        <p className="text-slate-300 font-medium italic">
                            {workout.focus}
                        </p>
                    </div>
                </div>
            </header>

            <div className="space-y-6">
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

            <div className={`mt-16 mb-24 sticky bottom-8 z-20 transition-all duration-500 ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
                }`}>
                <button
                    onClick={handleFinish}
                    className="w-full bg-[#ff477e] text-white py-5 rounded-2xl font-black text-lg tracking-widest uppercase shadow-[0_0_30px_rgba(255,71,126,0.4)] hover:shadow-[0_0_40px_rgba(255,71,126,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Complete Session
                </button>
            </div>
        </div>
    );
}
