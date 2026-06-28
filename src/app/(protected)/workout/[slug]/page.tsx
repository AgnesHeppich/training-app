'use client';

import { useParams, useRouter } from "next/navigation";
import { ExerciseLogTypes, WorkoutLog } from "@/hooks/useWorkoutHistory";
import { useWorkoutData } from "@/contexts/WorkoutDataContext";
import { ExerciseItem } from "@/components/ExerciseItem";
import { TimerModal } from "@/components/TimerModal";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorkoutPage() {
    const params = useParams();
    const router = useRouter();
    const { getEffectiveProgram, isAICoachUpdated, isLoaded, getPreviousStats, getPreviousNote, getAdaptedTarget, saveWorkoutLog, getLogForWorkout, getNotesForWorkout, getExerciseLogType, getPreviousLogType } = useWorkoutData();
    const [currentLogs, setCurrentLogs] = useState<WorkoutLog>({});
    const [currentNotes, setCurrentNotes] = useState<{ [exerciseName: string]: string }>({});
    const [currentLogTypes, setCurrentLogTypes] = useState<ExerciseLogTypes>({});
    const [sessionNote, setSessionNote] = useState('');
    const [sessionSummary, setSessionSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const lastScrollY = useRef(0);

    const workoutId = params.slug as string;
    const workout = getEffectiveProgram().find(d => d.id === workoutId);
    const isMounted = useRef(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isLoaded && workoutId && workout) {
            const existingLog = getLogForWorkout(workoutId);
            if (existingLog) setCurrentLogs(existingLog);
            const existingNotes = getNotesForWorkout(workoutId);
            if (existingNotes) setCurrentNotes(existingNotes);
            const logTypes: ExerciseLogTypes = {};
            for (const ex of workout.exercises) {
                logTypes[ex.name] = getExerciseLogType(ex.name, ex.reps, workoutId);
            }
            setCurrentLogTypes(logTypes);
            isMounted.current = true;
        }
    }, [isLoaded, workoutId]);

    useEffect(() => {
        if (isMounted.current && workoutId && (Object.keys(currentLogs).length > 0 || Object.keys(currentLogTypes).length > 0)) {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(() => {
                saveWorkoutLog(workoutId, currentLogs, false, currentNotes, currentLogTypes);
            }, 2000);
        }
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [currentLogs, currentNotes, currentLogTypes, workoutId]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
                setShowButton(false);
            } else if (currentScrollY < lastScrollY.current) {
                setShowButton(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { window.removeEventListener('scroll', handleScroll); };
    }, []);

    if (!isLoaded) return null;

    if (!workout) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl text-gray-900 mb-4 font-bold">Workout not found</h1>
                <Link href="/" className="text-green-700 hover:underline">Return Home</Link>
            </div>
        );
    }

    const handleGetSessionSummary = async () => {
        if (!workout) return;
        setLoadingSummary(true);
        try {
            const exercises = workout.exercises.map((exercise) => ({
                name: exercise.name,
                sets: exercise.sets,
                targetReps: getAdaptedTarget(exercise.name, exercise.reps, workoutId).adaptedReps ?? exercise.reps,
                actualLogs: currentLogs[exercise.name] ?? [],
                exerciseNote: currentNotes[exercise.name] || undefined,
                previousLogs: getPreviousStats(exercise.name, workoutId) || undefined,
            }));
            const res = await fetch('/api/section-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workoutTitle: workout.title,
                    workoutFocus: workout.focus,
                    exercises,
                    sessionNote: sessionNote || undefined,
                }),
            });
            const data = await res.json();
            setSessionSummary(data.summary);
        } finally {
            setLoadingSummary(false);
        }
    };

    const handleFinish = () => {
        saveWorkoutLog(workoutId, currentLogs, true, currentNotes, currentLogTypes);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#16a34a', '#ffffff', '#86efac']
        });

        setTimeout(() => {
            router.push('/');
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <header className="mb-12">
                <Link href="/" className="inline-flex items-center text-xs text-gray-500 hover:text-green-700 transition-colors mb-8 font-bold uppercase tracking-widest">
                    <span className="mr-2 text-lg">←</span> Dashboard
                </Link>
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <h2 className="text-[10px] text-green-700 font-black uppercase tracking-[0.2em] mb-2 px-1">
                            {workout.dayLabel} • Week {workout.week}
                        </h2>
                        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight">{workout.title}</h1>
                    </div>
                </div>
                <div className="mt-6 flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm">
                    <div className="w-1 self-stretch bg-green-500 rounded-full" />
                    <div>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Workout Focus</span>
                        <p className="text-gray-700 font-medium italic">
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
                            workoutId={workoutId}
                            logType={currentLogTypes[exercise.name] ?? getExerciseLogType(exercise.name, exercise.reps, workoutId)}
                            onLogTypeChange={(type) => {
                                setCurrentLogTypes(prev => ({ ...prev, [exercise.name]: type }));
                            }}
                            history={getPreviousStats(exercise.name, workoutId) || undefined}
                            previousLogType={getPreviousLogType(exercise.name, workoutId) || undefined}
                            initialLogs={currentLogs[exercise.name]}
                            adaptation={getAdaptedTarget(exercise.name, exercise.reps, workoutId)}
                            isAIAdapted={isAICoachUpdated(workoutId, exercise.name)}
                            previousNote={getPreviousNote(exercise.name, workoutId) || undefined}
                            initialNote={currentNotes[exercise.name]}
                            onLogChange={(logs) => {
                                setCurrentLogs(prev => ({ ...prev, [exercise.name]: logs }));
                            }}
                            onNoteChange={(note) => {
                                setCurrentNotes(prev => ({ ...prev, [exercise.name]: note }));
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 bg-white rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3">Session Notes</span>
                <textarea
                    placeholder="Any notes on this session overall... (e.g. felt tired, new PR, gym was crowded)"
                    value={sessionNote}
                    onChange={(e) => setSessionNote(e.target.value)}
                    rows={3}
                    className="w-full text-sm bg-gray-50 border-0 text-gray-900 rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:ring-4 focus:ring-gray-200/50 resize-none"
                />
            </div>

            {sessionSummary && (
                <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm">
                    <span className="text-[10px] text-green-700 font-black uppercase tracking-widest block mb-3">AI Coach</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{sessionSummary}</p>
                </div>
            )}

            <TimerModal />

            {!sessionSummary && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={handleGetSessionSummary}
                    disabled={loadingSummary}
                    aria-label="Get AI session summary"
                    className="fixed top-16 right-[calc((100vw-min(100vw,42rem))/2+0.25rem)] z-30 flex items-center gap-2 bg-white shadow-lg rounded-full px-3.5 py-2.5 text-green-700 hover:bg-green-50 hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                        <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
                        <path d="M19 13l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L17 15l1.5-.5.5-1.5z" />
                    </svg>
                    {loadingSummary && (
                        <span className="text-xs font-bold">Analysing...</span>
                    )}
                </motion.button>
            )}

            <div className={`mt-6 mb-24 sticky bottom-8 z-20 transition-all duration-500 ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
                <button
                    onClick={handleFinish}
                    className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg tracking-widest uppercase hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Complete Session
                </button>
            </div>
        </div>
    );
}
