import { useState, useRef, useCallback, useEffect } from 'react';

export type TimerMode = 'stopwatch' | 'interval';
export type IntervalPhase = 'idle' | 'work' | 'rest' | 'done';

export interface IntervalConfig {
  workSecs: number;
  restSecs: number;
  rounds: number;
}

const DEFAULT_CONFIG: IntervalConfig = { workSecs: 120, restSecs: 60, rounds: 3 };

export function useTimer() {
  const [mode, setModeState] = useState<TimerMode>('stopwatch');

  // Stopwatch state
  const [elapsed, setElapsed] = useState(0);

  // Interval state
  const [config, setConfigState] = useState<IntervalConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<IntervalPhase>('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [remaining, setRemaining] = useState(DEFAULT_CONFIG.workSecs);
  const [flash, setFlash] = useState<'work' | 'rest' | 'done' | null>(null);

  const [running, setRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // refs to read latest state inside interval callback without stale closure
  const phaseRef = useRef<IntervalPhase>('idle');
  const remainingRef = useRef(DEFAULT_CONFIG.workSecs);
  const currentRoundRef = useRef(1);
  const configRef = useRef(DEFAULT_CONFIG);
  const modeRef = useRef<TimerMode>('stopwatch');
  const elapsedRef = useRef(0);

  phaseRef.current = phase;
  remainingRef.current = remaining;
  currentRoundRef.current = currentRound;
  configRef.current = config;
  modeRef.current = mode;
  elapsedRef.current = elapsed;

  const triggerFlash = useCallback((type: 'work' | 'rest' | 'done') => {
    setFlash(type);
    setTimeout(() => setFlash(null), 600);
  }, []);

  const tick = useCallback(() => {
    if (modeRef.current === 'stopwatch') {
      setElapsed(e => e + 1);
      return;
    }

    const newRemaining = remainingRef.current - 1;
    if (newRemaining > 0) {
      setRemaining(newRemaining);
      return;
    }

    // Phase transition
    const cur = phaseRef.current;
    const cfg = configRef.current;
    const round = currentRoundRef.current;

    if (cur === 'work') {
      // Move to rest
      setPhase('rest');
      setRemaining(cfg.restSecs);
      triggerFlash('rest');
    } else if (cur === 'rest') {
      if (round >= cfg.rounds) {
        // All done
        setPhase('done');
        setRemaining(0);
        setRunning(false);
        triggerFlash('done');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Next round
        setCurrentRound(r => r + 1);
        setPhase('work');
        setRemaining(cfg.workSecs);
        triggerFlash('work');
      }
    }
  }, [triggerFlash]);

  const start = useCallback(() => {
    if (modeRef.current === 'interval' && phaseRef.current === 'idle') {
      setPhase('work');
      setRemaining(configRef.current.workSecs);
      setCurrentRound(1);
      triggerFlash('work');
    }
    setRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick, triggerFlash]);

  const pause = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setElapsed(0);
    setPhase('idle');
    setCurrentRound(1);
    setRemaining(configRef.current.workSecs);
    setFlash(null);
  }, [pause]);

  const setMode = useCallback((m: TimerMode) => {
    pause();
    setElapsed(0);
    setPhase('idle');
    setCurrentRound(1);
    setFlash(null);
    setModeState(m);
    // remaining will be set by next config or reset
    setRemaining(configRef.current.workSecs);
  }, [pause]);

  const setConfig = useCallback((cfg: Partial<IntervalConfig>) => {
    setConfigState(prev => {
      const next = { ...prev, ...cfg };
      configRef.current = next;
      // Update remaining if not running and in idle
      if (!running && phaseRef.current === 'idle') {
        setRemaining(next.workSecs);
      }
      return next;
    });
  }, [running]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const totalPhaseSecs = phase === 'work' ? config.workSecs : phase === 'rest' ? config.restSecs : 1;
  const progress = phase === 'idle' || phase === 'done' ? 0 : 1 - remaining / totalPhaseSecs;

  return {
    mode, setMode,
    // stopwatch
    elapsed,
    // interval
    config, setConfig,
    phase, currentRound, remaining, progress, flash,
    // shared
    running, start, pause, reset,
  };
}
