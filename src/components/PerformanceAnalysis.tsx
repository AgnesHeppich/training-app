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
        <div className="mb-16 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between gap-4 border-b border-slate-800/60">
                <div>
                    <h2 className="text-base font-black text-white tracking-tight">AI Coaching</h2>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Analyzes your sessions and adjusts the program</p>
                </div>
                <button
                    onClick={handleGetAnalysis}
                    disabled={isLoading}
                    className="shrink-0 bg-[#ff477e] text-white px-4 py-2 rounded-xl font-black text-[11px] tracking-widest uppercase shadow-[0_0_20px_rgba(255,71,126,0.3)] hover:shadow-[0_0_30px_rgba(255,71,126,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Analyzing…' : hasRequested ? 'Refresh' : 'Analyze'}
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="px-6 py-5">
                    <p className="text-sm text-slate-400 animate-pulse font-medium">Analyzing your performance…</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="px-6 py-5">
                    <p className="text-xs text-red-400 font-medium">Could not load analysis: {error}</p>
                </div>
            )}

            {result && !isLoading && (
                <div>
                    {/* Coaching response */}
                    <div className="px-6 py-5 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {result.coachingResponse}
                    </div>

                    {/* Program updates diff */}
                    {hasUpdates && (
                        <div className="border-t border-slate-800/60">
                            {/* Section header */}
                            <div className="px-6 py-4 bg-slate-800/30">
                                <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">
                                    Suggested Changes
                                </p>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    {result.updateReasons}
                                </p>
                            </div>

                            {/* Diff rows */}
                            <div className="divide-y divide-slate-800/40">
                                {result.programUpdates!.map((update, i) => (
                                    <div key={i} className="px-6 py-4">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <p className="text-sm font-semibold text-white leading-snug">
                                                {update.exerciseName}
                                            </p>
                                            <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">
                                                {update.field}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 mb-3">
                                            {update.workoutId}
                                        </p>
                                        {/* Value diff */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-950/50 rounded-xl px-4 py-2.5 text-center border border-slate-800/40">
                                                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1 font-bold">Current</p>
                                                <p className="text-base font-black text-slate-400 line-through decoration-slate-600">
                                                    {update.currentValue}
                                                </p>
                                            </div>
                                            <span className="text-slate-600 text-lg">→</span>
                                            <div className="flex-1 bg-[#ff477e]/5 rounded-xl px-4 py-2.5 text-center border border-[#ff477e]/20">
                                                <p className="text-[10px] text-[#ff477e]/60 uppercase tracking-wider mb-1 font-bold">New</p>
                                                <p className="text-base font-black text-[#ff477e]">
                                                    {update.suggestedValue}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Apply button */}
                            <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-800/40">
                                {!applied ? (
                                    <button
                                        onClick={handleApply}
                                        className="w-full bg-[#ff477e] text-white py-3 rounded-xl font-black text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(255,71,126,0.25)] hover:shadow-[0_0_30px_rgba(255,71,126,0.45)] transition-all active:scale-[0.98]"
                                    >
                                        Apply {result.programUpdates!.length} Change{result.programUpdates!.length !== 1 ? 's' : ''}
                                    </button>
                                ) : (
                                    <p className="text-center text-xs font-black uppercase tracking-widest text-emerald-400">
                                        ✓ Changes Applied
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* No updates reason */}
                    {!hasUpdates && result.updateReasons && (
                        <div className="border-t border-slate-800/60 px-6 py-4">
                            <p className="text-[11px] text-slate-500 italic">{result.updateReasons}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
