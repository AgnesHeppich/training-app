import { WorkoutDay } from "@/data/program";
import Link from "next/link";
import clsx from "clsx";

export const DayCard = ({ day, isCompleted }: { day: WorkoutDay; isCompleted: boolean }) => {
    return (
        <Link href={`/workout/${day.id}`} className="block h-full">
            <div className={clsx(
                "backdrop-blur-xl border rounded-2xl transition-all duration-300 bg-slate-900/40 hover:bg-slate-800/60 hover:-translate-y-1 p-5 h-full flex flex-col relative overflow-hidden group",
                isCompleted
                    ? "border-pink-500/40 bg-pink-500/5 shadow-[0_0_20px_rgba(255,71,126,0.1)]"
                    : "border-slate-800 hover:border-slate-700"
            )}>
                {isCompleted && (
                    <div className="absolute top-4 right-4 text-[#ff477e]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                <div className="mb-2 text-[10px] uppercase tracking-[0.15em] text-[#94a3b8] font-bold">
                    {day.dayLabel}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#ff477e] transition-colors leading-tight">
                    {day.title}
                </h3>

                <p className="text-sm text-slate-400 mb-4 flex-grow font-medium leading-normal">
                    {day.focus}
                </p>

                <div className="flex items-center text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    <span>{day.exercises.length} Exercises</span>
                </div>
            </div>
        </Link>
    );
};
