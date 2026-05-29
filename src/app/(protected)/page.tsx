'use client';

import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { useProgram } from "@/hooks/useProgram";
import { WeekOverview } from "@/components/WeekOverview";
import { PerformanceAnalysis } from "@/components/PerformanceAnalysis";
import { SignOutButton } from "@/components/SignOutButton";
import { NavMenu } from "@/components/NavMenu";
import { motion } from "framer-motion";

export default function Home() {
  const { getEffectiveProgram, applyUpdates, isLoaded: programLoaded, allPrograms, activeProgramId } = useProgram();
  const effectiveProgram = getEffectiveProgram();
  const { completedWorkoutIds, isLoaded, getPerformanceSummary, getLastSessions, getUpcomingSessions } = useWorkoutHistory(effectiveProgram, activeProgramId);

  if (!isLoaded || !programLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600 font-bold text-xl animate-pulse">
        Loading your gains...
      </div>
    );
  }

  const summary = getPerformanceSummary();
  const lastSessions = getLastSessions();
  const upcomingSessions = getUpcomingSessions();
  const allWeeks = Array.from(new Set(effectiveProgram.map(d => d.week))).sort((a, b) => a - b);
  const totalWeeks = allWeeks.length;
  const activeProgram = allPrograms.find(p => p.id === activeProgramId);
  const programName = activeProgram?.name ?? 'Antigravity';
  const programDescription = activeProgram?.description ?? `A definitive ${totalWeeks}-week progression`;
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-left"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-bold tracking-[0.2em] text-green-700 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
            Zero to Hero
          </div>

          <NavMenu />
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
          <span className="title-gradient">{programName.split(' ').slice(0, -1).join(' ') || programName}</span><br />
          <span className="text-green-700 green-glow">{programName.split(' ').slice(-1)[0]}</span>
        </h1>

        <p className="text-gray-500 text-xl max-w-xl leading-relaxed font-medium">
          {programDescription}
        </p>
      </motion.header>

      {/* Global Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16 p-8 rounded-3xl bg-white border border-gray-200 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Overall Program Mastery</span>
              <span className="text-sm font-black text-green-700">
                {Math.round((completedWorkoutIds.length / effectiveProgram.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedWorkoutIds.length / effectiveProgram.length) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-green-600 to-green-400"
              />
            </div>
          </div>
          <div className="flex gap-8 md:pl-8 md:border-l border-gray-200">
            <div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Sessions Done</span>
              <span className="text-3xl font-black text-gray-900">{completedWorkoutIds.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Weeks Mastered</span>
              <span className="text-3xl font-black text-gray-900">
                {allWeeks.filter(w => effectiveProgram.filter(d => d.week === w).every(d => completedWorkoutIds.includes(d.id))).length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <PerformanceAnalysis
        summary={summary}
        lastSessions={lastSessions}
        upcomingSessions={upcomingSessions}
        onApplyUpdates={applyUpdates}
      />

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

      <footer className="mt-24 text-center text-gray-400 text-[10px] pb-12 font-black uppercase tracking-[0.3em]">
        <p>Your Journey Starts Here</p>
        <SignOutButton />
        <button
          onClick={async () => {
            const [histRes, progRes] = await Promise.all([fetch('/api/history'), fetch('/api/program')]);
            const historyData = await histRes.json();
            const programData = await progRes.json();
            const exportData = {
              exportedAt: new Date().toISOString(),
              workoutHistory: historyData,
              programCustomizations: programData.overrides,
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `antigravity-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="mt-6 inline-block text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Export Data
        </button>
      </footer>
    </div>
  );
}
