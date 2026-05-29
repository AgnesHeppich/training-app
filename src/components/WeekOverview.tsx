import { WorkoutDay } from "@/data/program";
import { DayCard } from "./DayCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const WeekOverview = ({
    weekNumber,
    days,
    completedIds
}: {
    weekNumber: number;
    days: WorkoutDay[];
    completedIds: string[]
}) => {
    const completedCount = days.filter(d => completedIds.includes(d.id)).length;
    const isFullyCompleted = completedCount === days.length;
    const progress = (completedCount / days.length) * 100;

    const [isCollapsed, setIsCollapsed] = useState(isFullyCompleted);

    return (
        <div className="mb-12">
            <div
                className="flex items-end justify-between mb-4 px-1 cursor-pointer group"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Week {weekNumber}</h2>
                    {isFullyCompleted && (
                        <span className="text-[10px] bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 rounded-md font-black uppercase tracking-widest">
                            Completed
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-500 font-bold tracking-widest uppercase group-hover:text-gray-900 transition-colors">
                        {completedCount} / {days.length} Complete
                    </div>
                    <motion.svg
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </div>
            </div>

            {/* Progress Bar */}
            <div
                className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div
                    className="h-full bg-linear-to-r from-green-600 to-green-400 transition-all duration-700 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <AnimatePresence initial={false}>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {days.map((day) => (
                                <DayCard
                                    key={day.id}
                                    day={day}
                                    isCompleted={completedIds.includes(day.id)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isCollapsed && isFullyCompleted && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-400 font-medium italic mt-1 px-1"
                >
                    Target matched. Mastery achieved.
                </motion.p>
            )}
        </div>
    );
};
