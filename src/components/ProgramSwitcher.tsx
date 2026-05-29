'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProgramMeta } from '@/hooks/useProgram';

interface Props {
    programs: ProgramMeta[];
    activeProgramId: number | null;
    completedWorkoutIds: string[];
    currentProgramWorkoutIds: string[];
    onSwitch: (programId: number) => Promise<void>;
}

interface ConfirmState {
    program: ProgramMeta;
    currentName: string;
    sessionsCompleted: number;
}

export function ProgramSwitcher({
    programs,
    activeProgramId,
    completedWorkoutIds,
    currentProgramWorkoutIds,
    onSwitch,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
    const [switching, setSwitching] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    const activeProgram = programs.find(p => p.id === activeProgramId);
    const sessionsInCurrentProgram = completedWorkoutIds.filter(id =>
        currentProgramWorkoutIds.includes(id)
    ).length;
    const hasStarted = sessionsInCurrentProgram > 0;

    const filtered = programs.filter(p => {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    });

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchRef.current?.focus(), 150);
        } else {
            setSearch('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (confirmState) setConfirmState(null);
                else setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [confirmState]);

    const handleSelect = (program: ProgramMeta) => {
        if (program.id === activeProgramId) return;
        if (hasStarted && activeProgram) {
            setConfirmState({
                program,
                currentName: activeProgram.name,
                sessionsCompleted: sessionsInCurrentProgram,
            });
        } else {
            doSwitch(program.id);
        }
    };

    const doSwitch = async (programId: number) => {
        setSwitching(true);
        await onSwitch(programId);
        setSwitching(false);
    };

    const completionPercent = (program: ProgramMeta) => {
        if (program.id !== activeProgramId || program.workout_count === 0) return null;
        return Math.round((sessionsInCurrentProgram / program.workout_count) * 100);
    };

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff477e]" />
                <span className="max-w-[180px] truncate">{activeProgram?.name ?? 'Select Program'}</span>
                <svg
                    className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors"
                    viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                >
                    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => !confirmState && setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a0a0f] border-l border-slate-800/80 z-50 flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-slate-800/60">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
                                        Training Programs
                                    </p>
                                    <h2 className="text-xl font-black text-white">Switch Program</h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                                >
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Search */}
                            <div className="px-6 py-4 border-b border-slate-800/40">
                                <div className="relative">
                                    <svg
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600"
                                        viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                                    >
                                        <circle cx="6.5" cy="6.5" r="4" />
                                        <path d="M11 11l3 3" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search programs…"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600/20"
                                    />
                                </div>
                            </div>

                            {/* Program list */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                                {filtered.length === 0 && (
                                    <p className="text-center text-slate-600 text-sm py-12">No programs found</p>
                                )}
                                {filtered.map(program => {
                                    const isActive = program.id === activeProgramId;
                                    const pct = completionPercent(program);
                                    return (
                                        <button
                                            key={program.id}
                                            onClick={() => handleSelect(program)}
                                            disabled={isActive || switching}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                                                isActive
                                                    ? 'bg-[#ff477e]/10 border-[#ff477e]/30 cursor-default'
                                                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-700 cursor-pointer'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-1.5">
                                                <span className={`font-bold text-sm leading-tight ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                                    {program.name}
                                                </span>
                                                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                                                    {isActive && (
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#ff477e] bg-[#ff477e]/15 px-2 py-0.5 rounded-full">
                                                            <span className="w-1 h-1 rounded-full bg-[#ff477e] animate-pulse" />
                                                            Active
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-600 font-bold">
                                                        {program.workout_count}d
                                                    </span>
                                                </div>
                                            </div>
                                            {program.description && (
                                                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                                                    {program.description}
                                                </p>
                                            )}
                                            {isActive && pct !== null && (
                                                <div className="mt-2">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Progress</span>
                                                        <span className="text-[9px] text-[#ff477e] font-bold">{pct}%</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#ff477e] to-[#ff9eb5] rounded-full"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {!isActive && (
                                                <span className="text-[10px] text-slate-600 group-hover:text-slate-400 font-bold uppercase tracking-widest transition-colors">
                                                    Start program →
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Confirm switch modal */}
            <AnimatePresence>
                {confirmState && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-6"
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setConfirmState(null)} />
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                            className="relative bg-[#0d0d14] border border-slate-700/60 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-amber-400">
                                    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-black text-white mb-2">
                                Switch to {confirmState.program.name}?
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                You have completed{' '}
                                <span className="text-white font-bold">
                                    {confirmState.sessionsCompleted} session{confirmState.sessionsCompleted !== 1 ? 's' : ''}
                                </span>{' '}
                                in <span className="text-white font-bold">{confirmState.currentName}</span>. Your progress will be saved — you can switch back anytime.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmState(null)}
                                    className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const id = confirmState.program.id;
                                        setConfirmState(null);
                                        await doSwitch(id);
                                    }}
                                    disabled={switching}
                                    className="flex-1 py-3 rounded-2xl bg-[#ff477e] text-white text-sm font-black uppercase tracking-widest hover:bg-[#ff5f8f] transition-colors disabled:opacity-60"
                                >
                                    {switching ? 'Switching…' : 'Switch'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
