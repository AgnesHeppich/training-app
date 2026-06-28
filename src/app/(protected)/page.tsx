'use client';

import { useWorkoutData } from "@/contexts/WorkoutDataContext";
import { WeekOverview } from "@/components/WeekOverview";
import { PerformanceAnalysis } from "@/components/PerformanceAnalysis";
import { NavMenu } from "@/components/NavMenu";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const { getEffectiveProgram, applyUpdates, isLoaded, allPrograms, activeProgramId, completedWorkoutIds, getPerformanceSummary, getLastSessions, getUpcomingSessions } = useWorkoutData();
  const effectiveProgram = getEffectiveProgram();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600 font-bold text-xl animate-pulse">
        Loading your gains...
      </div>
    );
  }

  if (!activeProgramId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <NavMenu />
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">No program selected</h1>
        <p className="text-gray-500 text-sm">Pick a program to get started.</p>
        <Link
          href="/programs"
          className="px-6 py-3 rounded-2xl bg-green-600 text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-colors"
        >
          Browse Programs
        </Link>
      </div>
    );
  }

  const summary = getPerformanceSummary();
  const lastSessions = getLastSessions();
  const upcomingSessions = getUpcomingSessions();
  const allWeeks = Array.from(new Set(effectiveProgram.map(d => d.week))).sort((a, b) => a - b);
  const totalWeeks = allWeeks.length;
  const activeProgram = allPrograms.find(p => p.id === activeProgramId);
  const programName = activeProgram?.name ?? 'Workout Buddy';
  const programDescription = activeProgram?.description ?? `A definitive ${totalWeeks}-week progression`;
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="flex items-center justify-between mb-6">

          <NavMenu />
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
          <span className="title-gradient">{programName}</span><br />

        </h1>

        <div className="mt-8 flex justify-center">
          <div className="coach-portrait md:w-52 md:h-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/coach.png"
              alt="Workout coach mascot"
              width={1254}
              height={1254}
            />
          </div>
        </div>
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
              days={effectiveProgram.filter(d => d.week === weekNum)}
              completedIds={completedWorkoutIds}
            />
          </motion.div>
        ))}
      </div>

      <PerformanceAnalysis
        summary={summary}
        lastSessions={lastSessions}
        upcomingSessions={upcomingSessions}
        onApplyUpdates={applyUpdates}
      />

      <footer className="mt-24 text-center text-gray-400 text-[10px] pb-12 font-black uppercase tracking-[0.3em]">
        <p>Your Journey Starts Here</p>
      </footer>
    </div>
  );
}
