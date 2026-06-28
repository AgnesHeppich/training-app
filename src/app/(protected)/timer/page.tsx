'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
            value === p
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <div className="flex items-center gap-1 mb-3">
        <input
          type="number"
          min={0}
          max={59}
          value={mins}
          onChange={e => {
            const m = Math.max(0, Math.min(59, Number(e.target.value)));
            onChange(m * 60 + secs);
          }}
          className="w-16 text-center text-sm bg-gray-50 border-0 text-gray-900 rounded-xl px-2 py-2.5 outline-none focus:ring-2 focus:ring-gray-200"
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
          className="w-16 text-center text-sm bg-gray-50 border-0 text-gray-900 rounded-xl px-2 py-2.5 outline-none focus:ring-2 focus:ring-gray-200"
        />
        <span className="text-xs text-gray-400 font-medium">s</span>
      </div>
    </div>
  );
}

export default function TimerPage() {
  const timer = useTimer();

  const phaseColors = {
    work: { badge: 'text-green-700 bg-green-100', bar: 'bg-green-500' },
    rest: { badge: 'text-blue-600 bg-blue-100', bar: 'bg-blue-400' },
    done: { badge: 'text-gray-500 bg-gray-100', bar: 'bg-gray-300' },
    idle: { badge: 'text-gray-500 bg-gray-100', bar: 'bg-gray-300' },
  };

  const flashBg: Record<string, string> = {
    work: 'bg-green-50',
    rest: 'bg-blue-50',
    done: 'bg-green-100',
  };

  const isIntervalActive = timer.mode === 'interval' && timer.phase !== 'idle';
  const pageBg = timer.flash ? flashBg[timer.flash] : 'bg-white';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {/* Header */}
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-gray-500 hover:text-green-700 transition-colors mb-8 font-bold uppercase tracking-widest"
          >
            <span className="mr-2 text-lg">←</span> Dashboard
          </Link>
          <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight">Timer</h1>
        </header>

        {/* Mode toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-8">
          {(['stopwatch', 'interval'] as const).map(m => (
            <button
              key={m}
              onClick={() => timer.setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <span className="text-[clamp(4rem,20vw,8rem)] font-black tabular-nums tracking-tighter text-gray-900 leading-none">
              {formatHMS(timer.elapsed)}
            </span>

            <div className="flex gap-3 w-full">
              <button
                onClick={timer.running ? timer.pause : timer.start}
                className="flex-1 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.97] bg-green-600 text-white hover:bg-green-700"
              >
                {timer.running ? 'Pause' : timer.elapsed > 0 ? 'Resume' : 'Start'}
              </button>
              <button
                onClick={timer.reset}
                className="py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.97] transition-all"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}

        {/* ---- INTERVAL ---- */}
        {timer.mode === 'interval' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Config */}
            {timer.phase === 'idle' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-3xl p-5 shadow-sm">
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

                <div className="bg-gray-50 rounded-3xl p-5 shadow-sm">
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

                <div className="bg-gray-50 rounded-3xl p-5 shadow-sm">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-4">Rounds</span>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => timer.setConfig({ rounds: Math.max(1, timer.config.rounds - 1) })}
                      className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all font-bold"
                    >
                      −
                    </button>
                    <span className="text-4xl font-black text-gray-900 w-12 text-center tabular-nums">
                      {timer.config.rounds}
                    </span>
                    <button
                      onClick={() => timer.setConfig({ rounds: Math.min(20, timer.config.rounds + 1) })}
                      className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active / Done display */}
            {isIntervalActive && (
              <div className="flex flex-col items-center gap-5">
                <span className={`text-[10px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full ${phaseColors[timer.phase].badge}`}>
                  {timer.phase === 'done' ? 'All rounds complete!' : timer.phase}
                </span>

                {timer.phase !== 'done' && (
                  <>
                    <span className="text-[clamp(5rem,25vw,10rem)] font-black tabular-nums tracking-tighter text-gray-900 leading-none">
                      {formatMS(timer.remaining)}
                    </span>

                    <div className="w-full h-2 bg-app-track rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${phaseColors[timer.phase].bar}`}
                        animate={{ width: `${timer.progress * 100}%` }}
                        transition={{ duration: 0.8, ease: 'linear' }}
                      />
                    </div>

                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      Round {timer.currentRound} of {timer.config.rounds}
                    </span>
                  </>
                )}

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
                  className="flex-1 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.97] bg-green-600 text-white hover:bg-green-700"
                >
                  {timer.running ? 'Pause' : timer.phase === 'idle' ? 'Start' : 'Resume'}
                </button>
                {isIntervalActive && (
                  <button
                    onClick={timer.reset}
                    className="py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.97] transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
