'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer, IntervalConfig } from '@/hooks/useTimer';

function formatHMS(totalSecs: number) {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatMS(totalSecs: number) {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const WORK_PRESETS = [30, 60, 90, 120, 180, 300];
const REST_PRESETS = [15, 30, 60, 90, 120];

function PresetChips({ presets, value, onChange }: {
  presets: number[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            value === p
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
          }`}
        >
          {formatMS(p)}
        </button>
      ))}
    </div>
  );
}

function TimeInput({ label, value, onChange }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const mins = Math.floor(value / 60);
  const secs = value % 60;

  return (
    <div>
      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">{label}</span>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={59}
            value={mins}
            onChange={e => {
              const m = Math.max(0, Math.min(59, Number(e.target.value)));
              onChange(m * 60 + secs);
            }}
            className="w-14 text-center text-sm bg-gray-50 border-0 text-gray-900 rounded-xl px-2 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          />
          <span className="text-xs text-gray-400 font-medium">m</span>
          <input
            type="number"
            min={0}
            max={59}
            value={secs}
            onChange={e => {
              const s = Math.max(0, Math.min(59, Number(e.target.value)));
              onChange(mins * 60 + s);
            }}
            className="w-14 text-center text-sm bg-gray-50 border-0 text-gray-900 rounded-xl px-2 py-2 outline-none focus:ring-2 focus:ring-gray-200"
          />
          <span className="text-xs text-gray-400 font-medium">s</span>
        </div>
      </div>
    </div>
  );
}

export function TimerModal() {
  const [open, setOpen] = useState(false);
  const timer = useTimer();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const phaseColors = {
    work: 'text-green-700 bg-green-50',
    rest: 'text-blue-600 bg-blue-50',
    done: 'text-gray-500 bg-gray-100',
    idle: 'text-gray-500 bg-gray-100',
  };

  const flashBg = {
    work: 'bg-green-100',
    rest: 'bg-blue-100',
    done: 'bg-green-200',
  };

  const isIntervalActive = timer.mode === 'interval' && timer.phase !== 'idle';

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        <motion.button
          key="fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => setOpen(true)}
          aria-label="Open timer"
          className="fixed top-4 right-[calc((100vw-min(100vw,42rem))/2+0.25rem)] z-30 flex items-center gap-2 bg-white shadow-lg rounded-full px-3.5 py-2.5 text-gray-700 hover:shadow-xl active:scale-95 transition-all"
        >
          {/* Stopwatch icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M9.5 2.5h5" />
            <path d="M12 2.5v2" />
          </svg>
          {timer.running && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {timer.mode === 'stopwatch'
                ? formatHMS(timer.elapsed)
                : formatMS(timer.remaining)}
            </span>
          )}
          {!timer.running && timer.mode === 'interval' && timer.phase === 'done' && (
            <span className="text-xs font-bold text-gray-500">Done</span>
          )}
        </motion.button>
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className={`fixed bottom-0 inset-x-0 z-50 rounded-t-3xl shadow-2xl overflow-hidden max-h-[88dvh] flex flex-col transition-colors duration-300 ${
                timer.flash ? flashBg[timer.flash] : 'bg-white'
              }`}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 px-5 pb-10 pt-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Timer</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-95 transition-all text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-6">
                  {(['stopwatch', 'interval'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => timer.setMode(m)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        timer.mode === m
                          ? 'bg-white text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* ---- STOPWATCH ---- */}
                {timer.mode === 'stopwatch' && (
                  <div className="flex flex-col items-center gap-6">
                    <span className="text-7xl font-black tabular-nums tracking-tighter text-gray-900">
                      {formatHMS(timer.elapsed)}
                    </span>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={timer.running ? timer.pause : timer.start}
                        className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.97] bg-green-600 text-white hover:bg-green-700"
                      >
                        {timer.running ? 'Pause' : timer.elapsed > 0 ? 'Resume' : 'Start'}
                      </button>
                      <button
                        onClick={timer.reset}
                        className="py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.97] transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* ---- INTERVAL ---- */}
                {timer.mode === 'interval' && (
                  <div className="flex flex-col gap-5">

                    {/* Config (shown only when idle) */}
                    {timer.phase === 'idle' && (
                      <div className="space-y-5">
                        <div>
                          <TimeInput
                            label="Work time"
                            value={timer.config.workSecs}
                            onChange={v => timer.setConfig({ workSecs: Math.max(5, v) })}
                          />
                          <PresetChips
                            presets={WORK_PRESETS}
                            value={timer.config.workSecs}
                            onChange={v => timer.setConfig({ workSecs: v })}
                          />
                        </div>

                        <div>
                          <TimeInput
                            label="Rest time"
                            value={timer.config.restSecs}
                            onChange={v => timer.setConfig({ restSecs: Math.max(5, v) })}
                          />
                          <PresetChips
                            presets={REST_PRESETS}
                            value={timer.config.restSecs}
                            onChange={v => timer.setConfig({ restSecs: v })}
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-3">Rounds</span>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => timer.setConfig({ rounds: Math.max(1, timer.config.rounds - 1) })}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-200 active:scale-95 transition-all font-bold"
                            >
                              −
                            </button>
                            <span className="text-3xl font-black text-gray-900 w-10 text-center tabular-nums">
                              {timer.config.rounds}
                            </span>
                            <button
                              onClick={() => timer.setConfig({ rounds: Math.min(20, timer.config.rounds + 1) })}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-200 active:scale-95 transition-all font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Active / Done display */}
                    {isIntervalActive && (
                      <div className="flex flex-col items-center gap-4">
                        {/* Phase badge */}
                        <span className={`text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full ${phaseColors[timer.phase]}`}>
                          {timer.phase === 'done' ? 'All rounds complete!' : timer.phase}
                        </span>

                        {/* Big time */}
                        {timer.phase !== 'done' && (
                          <span className="text-8xl font-black tabular-nums tracking-tighter text-gray-900">
                            {formatMS(timer.remaining)}
                          </span>
                        )}

                        {/* Progress bar */}
                        {timer.phase !== 'done' && (
                          <div className="w-full h-1.5 bg-app-track rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${timer.phase === 'work' ? 'bg-green-500' : 'bg-blue-400'}`}
                              animate={{ width: `${timer.progress * 100}%` }}
                              transition={{ duration: 0.8, ease: 'linear' }}
                            />
                          </div>
                        )}

                        {/* Round counter */}
                        {timer.phase !== 'done' && (
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                            Round {timer.currentRound} of {timer.config.rounds}
                          </span>
                        )}

                        {/* Back to config */}
                        <button
                          onClick={timer.reset}
                          className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 transition-colors mt-1"
                        >
                          ← Back to config
                        </button>
                      </div>
                    )}

                    {/* Controls */}
                    {timer.phase !== 'done' && (
                      <div className="flex gap-3">
                        <button
                          onClick={timer.running ? timer.pause : timer.start}
                          className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.97] bg-green-600 text-white hover:bg-green-700"
                        >
                          {timer.running ? 'Pause' : timer.phase === 'idle' ? 'Start' : 'Resume'}
                        </button>
                        {isIntervalActive && (
                          <button
                            onClick={timer.reset}
                            className="py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.97] transition-all"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
