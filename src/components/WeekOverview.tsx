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
    const hasProgress = completedCount > 0;
    const progress = (completedCount / days.length) * 100;

    const [isCollapsed, setIsCollapsed] = useState(isFullyCompleted);

    return (
        <div
            className={clsx(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                isCollapsed
                    ? isFullyCompleted
                        ? "bg-green-50/60 border-green-200/80"
                        : "bg-white border-gray-200/80 shadow-sm"
                    : "bg-white border-gray-200 shadow-md"
            )}
        >
            <button
                type="button"
                className="w-full flex items-center gap-3 sm:gap-4 p-4 text-left cursor-pointer group"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-expanded={!isCollapsed}
            >
                <div
                    className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isFullyCompleted
                            ? "bg-green-600 text-white"
                            : hasProgress
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                    )}
                >
                    {isFullyCompleted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <span className="text-sm font-black tabular-nums">{weekNumber}</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                            Week {weekNumber}
                        </h2>
                        <span
                            className={clsx(
                                "text-xs font-semibold tabular-nums shrink-0",
                                isFullyCompleted ? "text-green-700" : "text-gray-500"
                            )}
                        >
                            {isFullyCompleted ? "Complete" : `${completedCount} of ${days.length}`}
                        </span>
                    </div>
                    <div className="h-1.5 bg-app-track/80 rounded-full overflow-hidden">
                        <motion.div
                            className={clsx(
                                "h-full rounded-full",
                                isFullyCompleted
                                    ? "bg-green-500"
                                    : "bg-linear-to-r from-green-600 to-green-400"
                            )}
                            initial={false}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                <motion.svg
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            <AnimatePresence initial={false}>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {days.map((day) => (
                                    <DayCard
                                        key={day.id}
                                        day={day}
                                        isCompleted={completedIds.includes(day.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
