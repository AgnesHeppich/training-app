'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const GOAL_TYPES = [
    { id: 'strength', label: 'Strength' },
    { id: 'hypertrophy', label: 'Hypertrophy' },
    { id: 'running', label: 'Running' },
    { id: 'general', label: 'General Fitness' },
    { id: 'mobility', label: 'Mobility' },
] as const;

type GoalType = typeof GOAL_TYPES[number]['id'];

export default function BuildProgramPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [goalType, setGoalType] = useState<GoalType>('strength');
    const [weeks, setWeeks] = useState(4);
    const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
    const [variation, setVariation] = useState('');
    const [weakness, setWeakness] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe what you want from your program.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/programs/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    goalType,
                    weeks,
                    sessionsPerWeek,
                    variation: variation.trim() || undefined,
                    weakness: weakness.trim() || undefined,
                }),
            });
            if (!res.ok) {
                let message = 'Failed to generate program';
                try {
                    const data = await res.json();
                    message = data.error ?? message;
                } catch { /* non-JSON error body */ }
                throw new Error(message);
            }
            router.push('/');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
            setLoading(false);
        }
    };

    const totalSessions = weeks * sessionsPerWeek;

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-xs font-black uppercase tracking-[0.2em] transition-colors mb-8"
                >
                    ← Back
                </Link>
                <h1 className="text-4xl font-black tracking-tight text-gray-900">Build a Program</h1>
                <p className="text-gray-500 text-sm mt-2">Describe your goal and we'll generate a personalised program for you.</p>
            </motion.div>

            <div className="space-y-7">
                {/* Goal type */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                        Program type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {GOAL_TYPES.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setGoalType(g.id)}
                                disabled={loading}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
                                    goalType === g.id
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
                                }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Prompt */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        What's your goal?
                    </label>
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g. I want to improve my pull-ups. I can currently do 3 and want to get to 5."
                        rows={3}
                        disabled={loading}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm resize-none disabled:opacity-50"
                    />
                </motion.div>

                {/* Duration */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        Duration — {weeks} {weeks === 1 ? 'week' : 'weeks'}
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min={1}
                            max={16}
                            value={weeks}
                            onChange={e => setWeeks(Number(e.target.value))}
                            disabled={loading}
                            className="flex-1 accent-green-600 disabled:opacity-50"
                        />
                        <span className="w-16 text-right text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
                            {weeks}w
                        </span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400">1 week</span>
                        <span className="text-[10px] text-gray-400">16 weeks</span>
                    </div>
                </motion.div>

                {/* Sessions per week */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                        Sessions per week
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(n => (
                            <button
                                key={n}
                                onClick={() => setSessionsPerWeek(n)}
                                disabled={loading}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-50 ${
                                    sessionsPerWeek === n
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
                                }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Variation */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        Training mix <span className="normal-case font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        value={variation}
                        onChange={e => setVariation(e.target.value)}
                        placeholder="e.g. 40 min cardio spread across 2 sessions per week, one session should be strength focused"
                        rows={2}
                        disabled={loading}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm resize-none disabled:opacity-50"
                    />
                </motion.div>

                {/* Weaknesses */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        Injuries or limitations <span className="normal-case font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        value={weakness}
                        onChange={e => setWeakness(e.target.value)}
                        placeholder="e.g. my left knee starts hurting after a week of running, shoulder impingement"
                        rows={2}
                        disabled={loading}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm resize-none disabled:opacity-50"
                    />
                </motion.div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.23 }}
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4"
                >
                    <p className="text-xs text-gray-500">
                        Generating a{' '}
                        <span className="font-bold text-gray-900">{weeks}-week {GOAL_TYPES.find(g => g.id === goalType)?.label.toLowerCase()}</span> program with{' '}
                        <span className="font-bold text-gray-900">{sessionsPerWeek} sessions/week</span> —{' '}
                        <span className="font-bold text-gray-900">{totalSessions} sessions</span> total. It will become your active program.
                    </p>
                </motion.div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-600 font-medium"
                    >
                        {error}
                    </motion.p>
                )}

                {/* Generate button */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="w-full py-4 rounded-2xl bg-green-600 text-white text-sm font-black uppercase tracking-widest hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Generating your program…
                            </span>
                        ) : (
                            'Generate Program'
                        )}
                    </button>
                    {loading && (
                        <p className="text-center text-xs text-gray-400 mt-3">
                            This usually takes 10–20 seconds. Hang tight!
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
