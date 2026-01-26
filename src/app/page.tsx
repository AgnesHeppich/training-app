'use client';

import { PROGRAM } from "@/data/program";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { WeekOverview } from "@/components/WeekOverview";
import { motion } from "framer-motion";

export default function Home() {
  const { completedWorkouts, isLoaded } = useWorkoutHistory();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#ff477e] font-bold text-xl animate-pulse">
        Loading your gains...
      </div>
    );
  }

  const allWeeks = Array.from(new Set(PROGRAM.map(d => d.week))).sort((a, b) => a - b);
  const totalWeeks = allWeeks.length;

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-left"
      >
        <div className="inline-flex items-center gap-2 py-1 px-3 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[10px] font-bold tracking-[0.2em] text-[#ff477e] mb-6 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff477e] animate-pulse" />
          Zero to Hero
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
          <span className="title-gradient">Pull-Up</span><br />
          <span className="text-[#ff477e] pink-glow">Mastery</span>
        </h1>

        <p className="text-[#94a3b8] text-xl max-w-xl leading-relaxed font-medium">
          A definitive {totalWeeks}-week progression from assisted reps to unassisted dominance.
        </p>
      </motion.header>

      {/* Global Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Overall Program Mastery</span>
              <span className="text-sm font-black text-[#ff477e] pink-glow">
                {Math.round((completedWorkouts.length / PROGRAM.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-950/50 rounded-full overflow-hidden border border-slate-800/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedWorkouts.length / PROGRAM.length) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#ff477e] to-[#ff9eb5] shadow-[0_0_15px_rgba(255,71,126,0.3)]"
              />
            </div>
          </div>
          <div className="flex gap-8 md:pl-8 md:border-l border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Sessions Done</span>
              <span className="text-3xl font-black text-white">{completedWorkouts.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Weeks Mastered</span>
              <span className="text-3xl font-black text-white">
                {allWeeks.filter(w => PROGRAM.filter(d => d.week === w).every(d => completedWorkouts.includes(d.id))).length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {allWeeks.map((weekNum, idx) => (
          <motion.div
            key={weekNum}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <WeekOverview
              weekNumber={weekNum}
              days={PROGRAM.filter(d => d.week === weekNum)}
              completedIds={completedWorkouts}
            />
          </motion.div>
        ))}
      </div>

      <footer className="mt-24 text-center text-slate-600 text-[10px] pb-12 font-black uppercase tracking-[0.3em]">
        <p>Your Journey Starts Here</p>
      </footer>
    </div>
  );
}
