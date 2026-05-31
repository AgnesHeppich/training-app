'use client';

import { useState } from 'react';
import { useProgram } from '@/hooks/useProgram';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { ProgramMeta } from '@/hooks/useProgram';

interface ConfirmState {
  program: ProgramMeta;
  currentName: string;
  sessionsCompleted: number;
}

export default function ProgramsPage() {
  const {
    getEffectiveProgram,
    isLoaded: programLoaded,
    allPrograms,
    activeProgramId,
    switchProgram,
  } = useProgram();

  const effectiveProgram = getEffectiveProgram();
  const { completedWorkoutIds, isLoaded: historyLoaded } = useWorkoutHistory(effectiveProgram, activeProgramId);

  const [search, setSearch] = useState('');
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [switching, setSwitching] = useState(false);

  if (!programLoaded || !historyLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600 font-bold text-xl animate-pulse">
        Loading programs...
      </div>
    );
  }

  const activeProgram = allPrograms.find(p => p.id === activeProgramId);
  const currentProgramWorkoutIds = effectiveProgram.map(d => d.id);
  const sessionsInCurrentProgram = completedWorkoutIds.filter(id =>
    currentProgramWorkoutIds.includes(id)
  ).length;
  const hasStarted = sessionsInCurrentProgram > 0;

  const filtered = allPrograms.filter(p => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
  });

  const generalPrograms = filtered.filter(p => !p.is_generated);
  const myPrograms = filtered.filter(p => p.is_generated);

  const completionPercent = (program: ProgramMeta) => {
    if (program.id !== activeProgramId || program.workout_count === 0) return null;
    return Math.round((sessionsInCurrentProgram / program.workout_count) * 100);
  };

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
    await switchProgram(programId);
    setSwitching(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-xs font-black uppercase tracking-[0.2em] transition-colors mb-8"
        >
          ← Back
        </Link>
        <h1 className="text-4xl font-black tracking-tight text-gray-900">Programs</h1>
        <p className="text-gray-500 text-sm mt-2">Select the program you want to train.</p>
        <Link
          href="/programs/build"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-2xl bg-green-600 text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-colors shadow-sm"
        >
          + Build a Program
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="6.5" cy="6.5" r="4" />
            <path d="M11 11l3 3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search programs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Program list */}
      <div className="space-y-6">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">No programs found</p>
        )}

        {generalPrograms.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">General Programs</p>
            <div className="space-y-3">
              {generalPrograms.map((program, idx) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  idx={idx}
                  isActive={program.id === activeProgramId}
                  pct={completionPercent(program)}
                  switching={switching}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </section>
        )}

        {myPrograms.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">My Programs</p>
            <div className="space-y-3">
              {myPrograms.map((program, idx) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  idx={generalPrograms.length + idx}
                  isActive={program.id === activeProgramId}
                  pct={completionPercent(program)}
                  switching={switching}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Confirm switch modal */}
      <AnimatePresence>
        {confirmState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setConfirmState(null)} />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              className="relative bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-amber-500">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-2">
                Switch to {confirmState.program.name}?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                You have completed{' '}
                <span className="text-gray-900 font-bold">
                  {confirmState.sessionsCompleted} session{confirmState.sessionsCompleted !== 1 ? 's' : ''}
                </span>{' '}
                in <span className="text-gray-900 font-bold">{confirmState.currentName}</span>. Your progress will be saved — you can switch back anytime.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmState(null)}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors"
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
                  className="flex-1 py-3 rounded-2xl bg-green-600 text-white text-sm font-black uppercase tracking-widest hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  {switching ? 'Switching…' : 'Switch'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgramCard({
  program, idx, isActive, pct, switching, onSelect,
}: {
  program: ProgramMeta;
  idx: number;
  isActive: boolean;
  pct: number | null;
  switching: boolean;
  onSelect: (p: ProgramMeta) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + idx * 0.05 }}
      onClick={() => onSelect(program)}
      disabled={isActive || switching}
      className={`w-full text-left p-5 rounded-2xl border transition-all group ${
        isActive
          ? 'bg-green-50 border-green-300 cursor-default shadow-sm'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <span className={`font-bold text-sm leading-tight ${isActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
          {program.name}
        </span>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {isActive && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-green-700 bg-green-500/15 px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 rounded-full bg-green-600 animate-pulse" />
              Active
            </span>
          )}
          <span className="text-[10px] text-gray-400 font-bold">
            {program.workout_count} sessions
          </span>
        </div>
      </div>

      {program.description && (
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          {program.description}
        </p>
      )}

      {isActive && pct !== null && (
        <div className="mt-1">
          <div className="flex justify-between mb-1.5">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Progress</span>
            <span className="text-[9px] text-green-700 font-bold">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-green-600 to-green-400 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {!isActive && (
        <span className="text-[10px] text-gray-400 group-hover:text-green-700 font-bold uppercase tracking-widest transition-colors">
          Switch to this program →
        </span>
      )}
    </motion.button>
  );
}
