'use client';

import { PROGRAM } from "@/data/program";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { WeekOverview } from "@/components/WeekOverview";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const { completedWorkouts, isLoaded } = useWorkoutHistory();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#ff477e] font-bold text-xl animate-pulse">
        Loading your gains...
      </div>
    );
  }

  const weeks = [1, 2, 3, 4];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center flex flex-col items-center overflow-visible"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 relative w-48 h-48 md:w-64 md:h-64"
        >
          {/* Container with theme-consistent pink gradient and shadow */}
          <div className="w-full h-full relative rounded-full overflow-hidden bg-gradient-to-br from-[#ff477e]/20 to-[#ff9eb5]/10 shadow-[0_15px_35px_rgba(255,71,126,0.25)] border border-white/20">
            <Image
              src="/header-illustration.png"
              alt="Funny 3D Workout Illustration"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <div className="inline-block py-1 px-4 rounded-full bg-white/40 border border-white/60 text-xs font-bold tracking-widest text-[#ff477e] mb-4 shadow-sm backdrop-blur-md">
          ZERO TO HERO
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
          <span className="text-[#5c2b2b]">Pull-Up</span>{" "}
          <span className="title-gradient filter drop-shadow-lg">Mastery</span>
        </h1>
        <p className="text-[#8e5e5e] text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          From assisted reps to unassisted dominance in 4 weeks. Track your weights, perfect your form.
        </p>
      </motion.header>

      <div className="space-y-8">
        {weeks.map((weekNum, idx) => (
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

      <footer className="mt-20 text-center text-[#8e5e5e]/60 text-sm pb-8 font-medium">
        <p>Your Journey Starts Here</p>
      </footer>
    </div>
  );
}
