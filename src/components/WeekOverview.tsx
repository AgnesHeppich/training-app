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
        <div className="mb-8">
            <div className="flex items-end justify-between mb-3 px-2">
                <h2 className="text-2xl font-bold text-[#5c2b2b]">Week {weekNumber}</h2>
                <div className="text-sm text-[#8e5e5e] font-semibold">
                    {completedCount}/{days.length} Completed
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-white/50 rounded-full mb-4 overflow-hidden border border-white/50 shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-[#ff477e] to-[#ff9eb5] transition-all duration-500 ease-out shadow-lg"
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
