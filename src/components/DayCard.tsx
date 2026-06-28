import { WorkoutDay } from "@/data/program";
import Link from "next/link";
import clsx from "clsx";

export const DayCard = ({ day, isCompleted }: { day: WorkoutDay; isCompleted: boolean }) => {
    return (
        <Link href={`/workout/${day.id}`} className="block h-full">
            <div className={clsx(
                "rounded-2xl transition-all duration-300 hover:-translate-y-1 p-5 h-full flex flex-col relative overflow-hidden group bg-white shadow-sm",
                isCompleted && "bg-green-50",
                !isCompleted && "hover:shadow-md"
            )}>
                {isCompleted && (
                    <div className="absolute top-4 right-4 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                <div className="mb-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold">
                    {day.dayLabel}
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-green-700 transition-colors leading-tight">
                    {day.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4 grow font-medium leading-normal">
                    {day.focus}
                </p>

                <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-widest font-black">
                    <span>{day.exercises.length} Exercises</span>
                </div>
            </div>
        </Link>
    );
};
