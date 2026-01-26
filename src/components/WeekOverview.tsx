import { WorkoutDay } from "@/data/program";
import { DayCard } from "./DayCard";
import { motion } from "framer-motion";

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
    const progress = (completedCount / days.length) * 100;

    return (
        <div className="mb-12">
            <div className="flex items-end justify-between mb-4 px-1">
                <h2 className="text-3xl font-black text-white tracking-tight">Week {weekNumber}</h2>
                <div className="text-xs text-[#94a3b8] font-bold tracking-widest uppercase">
                    {completedCount} / {days.length} Complete
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-800/50 rounded-full mb-6 overflow-hidden border border-slate-700/30">
                <div
                    className="h-full bg-gradient-to-r from-[#ff477e] to-[#ff9eb5] transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(255,71,126,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {days.map((day, idx) => (
                    <DayCard
                        key={day.id}
                        day={day}
                        isCompleted={completedIds.includes(day.id)}
                    />
                ))}
            </div>
        </div>
    );
};
