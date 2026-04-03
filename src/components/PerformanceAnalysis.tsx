'use client';

import { useState } from 'react';
import { PerformanceSummary } from '@/hooks/useWorkoutHistory';
import { AnalysisResult, ProgramUpdate } from '@/lib/analysisSchema';

type SessionExercise = {
    name: string;
    programSets: number;
    programTarget: string;
    actualSets?: { weight: string; reps: string }[];
};

type Session = {
    id: string;
    week: number;
    dayLabel: string;
    title: string;
    exercises: SessionExercise[];
};

type Props = {
    summary: PerformanceSummary;
    lastSessions: Session[] | null;
    upcomingSessions: Session[];
    onApplyUpdates: (updates: ProgramUpdate[]) => void;
};

export const PerformanceAnalysis = ({ summary, lastSessions, upcomingSessions, onApplyUpdates }: Props) => {
    const [hasRequested, setHasRequested] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [applied, setApplied] = useState(false);

    const handleGetAnalysis = async () => {
        setHasRequested(true);
        setIsLoading(true);
        setError(null);
        setApplied(false);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ summary, lastSessions, upcomingSessions }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: AnalysisResult = await res.json();
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (result?.programUpdates?.length) {
            onApplyUpdates(result.programUpdates);
            setApplied(true);
        }
    };

    if (summary.totalCompleted === 0) return null;

    const hasUpdates = (result?.programUpdates?.length ?? 0) > 0;

    return (
        <div className="mb-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight">AI Coaching</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Analysis of your pull-up progression</p>
                </div>
                <button
                    onClick={handleGetAnalysis}
                    disabled={isLoading}
                    className="bg-[#ff477e] text-white px-5 py-2.5 rounded-xl font-black text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(255,71,126,0.3)] hover:shadow-[0_0_30px_rgba(255,71,126,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Analyzing...' : hasRequested ? 'Refresh' : 'Get Coaching'}
                </button>
            </div>

            {isLoading && (
                <p className="text-sm text-slate-400 animate-pulse font-medium">Analyzing your performance...</p>
            )}

            {error && (
                <p className="text-xs text-red-400 font-medium">Could not load analysis: {error}</p>
            )}

            {result && !isLoading && (
                <div className="space-y-6">
                    {/* Coaching response */}
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {result.coachingResponse}
                    </div>

                    {/* Program updates */}
                    {hasUpdates && (
                        <div className="border border-slate-700/60 rounded-2xl overflow-hidden">
                            <div className="px-5 py-3 bg-slate-800/50 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Suggested Program Changes</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{result.updateReasons}</p>
                                </div>
                                {!applied ? (
                                    <button
                                        onClick={handleApply}
                                        className="ml-4 shrink-0 bg-[#ff477e]/10 border border-[#ff477e]/30 text-[#ff477e] px-4 py-1.5 rounded-lg font-black text-[10px] tracking-widest uppercase hover:bg-[#ff477e]/20 transition-all"
                                    >
                                        Apply Changes
                                    </button>
                                ) : (
                                    <span className="ml-4 shrink-0 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                        ✓ Applied
                                    </span>
                                )}
                            </div>

                            <div className="divide-y divide-slate-800/60">
                                {result.programUpdates!.map((update, i) => (
                                    <div key={i} className="px-5 py-3 flex items-center gap-4 text-xs">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold truncate">{update.exerciseName}</p>
                                            <p className="text-slate-500 text-[11px]">
                                                {update.workoutId} · {update.field}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 font-mono">
                                            <span className="text-slate-400 line-through">{update.currentValue}</span>
                                            <span className="text-slate-600">→</span>
                                            <span className="text-[#ff477e] font-bold">{update.suggestedValue}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!hasUpdates && result.updateReasons && (
                        <p className="text-[11px] text-slate-500 italic">{result.updateReasons}</p>
                    )}
                </div>
            )}
        </div>
    );
};
