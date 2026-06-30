import { WorkoutDay } from "@/data/program";
import Link from "next/link";
import clsx from "clsx";

export const DayCard = ({ day, isCompleted }: { day: WorkoutDay; isCompleted: boolean }) => {
    return (
        <Link href={`/workout/${day.id}`} className="block h-full">
            <div className={clsx(
                "rounded-2xl transition-all duration-300 p-5 h-full flex flex-col relative overflow-hidden group shadow-sm",
                isCompleted
                    ? "bg-green-50 border-2 border-green-200 hover:-translate-y-0.5"
                    : "bg-white hover:-translate-y-1 hover:shadow-md"
            )}>
                {isCompleted && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-2xl" />
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={clsx(
                        "text-[10px] uppercase tracking-[0.15em] font-bold",
                        isCompleted ? "text-green-700" : "text-gray-500"
                    )}>
                        {day.dayLabel}
                    </div>
                    {isCompleted && (
                        <span className="flex items-center gap-1 rounded-full bg-green-600 pl-1.5 pr-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide shrink-0">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Done
                        </span>
                    )}
                </div>

                <h3 className={clsx(
                    "text-xl font-bold mb-2 transition-colors leading-tight",
                    isCompleted
                        ? "text-green-800"
                        : "text-gray-900 group-hover:text-green-700"
                )}>
                    {day.title}
                </h3>

                <p className={clsx(
                    "text-sm mb-4 grow font-medium leading-normal",
                    isCompleted ? "text-green-700/70" : "text-gray-500"
                )}>
                    {day.focus}
                </p>

                <div className={clsx(
                    "flex items-center text-[10px] uppercase tracking-widest font-black",
                    isCompleted ? "text-green-600" : "text-gray-400"
                )}>
                    <span>{day.exercises.length} Exercises</span>
                </div>
            </div>
        </Link>
    );
};
