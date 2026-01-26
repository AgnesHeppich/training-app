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
