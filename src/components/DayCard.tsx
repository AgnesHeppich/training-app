import { WorkoutDay } from "@/data/program";
import Link from "next/link";
import clsx from "clsx";

export const DayCard = ({ day, isCompleted }: { day: WorkoutDay; isCompleted: boolean }) => {
    return (
        <Link href={`/workout/${day.id}`} className="block h-full">
            <div className={clsx(
                "backdrop-blur-xl border rounded-3xl transition-all duration-300 bg-white/20 hover:bg-white/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 p-6 h-full flex flex-col relative overflow-hidden group",
                isCompleted ? "border-green-400/50 shadow-[0_0_15px_rgba(52,211,153,0.2)] bg-green-50/20" : "border-white/40"
            )}>
                {isCompleted && (
                    <div className="absolute top-4 right-4 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                <div className="mb-2 text-xs uppercase tracking-widest text-[#ff477e] font-bold">
                    {day.dayLabel}
                </div>

                <h3 className="text-xl font-bold mb-2 text-[#5c2b2b] group-hover:text-[#ff477e] transition-colors">
                    {day.title}
                </h3>

                <p className="text-sm text-[#8e5e5e] mb-4 flex-grow font-medium">
                    {day.focus}
                </p>

                <div className="flex items-center text-xs text-[#8e5e5e]/80 mt-auto font-semibold">
                    <span>{day.exercises.length} Exercises</span>
                </div>
            </div>
        </Link>
    );
};
