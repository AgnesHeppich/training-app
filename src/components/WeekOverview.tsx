import { WorkoutDay } from "@/data/program";
import { DayCard } from "./DayCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

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

    const isCompact = isCollapsed && isFullyCompleted;

    return (
        <div className={clsx(isCompact ? "mb-5" : "mb-8")}>
            <div
                className="flex items-center justify-between gap-3 px-1 cursor-pointer group flex-nowrap"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <h2 className="text-base font-bold text-gray-900 tracking-tight whitespace-nowrap">
                    Week {weekNumber}
                </h2>

                <div className="flex items-center gap-2 shrink-0">
                    <span className={clsx(
                        "text-[10px] font-medium tabular-nums whitespace-nowrap",
                        isFullyCompleted ? "text-green-700" : "text-gray-500"
                    )}>
                        {completedCount}/{days.length}
                    </span>
                    <motion.svg
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                </div>
            </div>

            <div
                className={clsx(
                    "h-0.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer mt-1.5",
                    !isCompact && "mb-4"
                )}
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
        </div>
    );
};
