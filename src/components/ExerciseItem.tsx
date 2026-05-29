import { Exercise } from "@/data/program";
import { AdaptedTarget, SetLog } from "@/hooks/useWorkoutHistory";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface ExerciseItemProps {
    exercise: Exercise;
    history?: SetLog[];
    onLogChange: (logs: SetLog[]) => void;
    initialLogs?: SetLog[];
    adaptation?: AdaptedTarget;
    isAIAdapted?: boolean;
    previousNote?: string;
    initialNote?: string;
    onNoteChange: (note: string) => void;
}

export const ExerciseItem = ({ exercise, history, onLogChange, initialLogs, adaptation, isAIAdapted, previousNote, initialNote, onNoteChange }: ExerciseItemProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const currentLogs = initialLogs || Array(exercise.sets).fill({ weight: "", reps: "" });

    useEffect(() => {
        if (!initialLogs) {
            const defaults = Array(exercise.sets).fill(null).map((_, idx) => {
                return {
                    weight: history?.[idx]?.weight || history?.[0]?.weight || "",
                    reps: ""
                };
            });
            if (defaults.some(d => d.weight !== "")) {
                onLogChange(defaults);
            }
        }
    }, []);

    const handleChange = (index: number, field: keyof SetLog, value: string) => {
        const newLogs = [...currentLogs];
        if (!newLogs[index]) newLogs[index] = { weight: "", reps: "" };
        newLogs[index] = { ...newLogs[index], [field]: value };
        onLogChange(newLogs);
    };

    const isSetComplete = (log: SetLog) => log.weight !== "" && log.reps !== "";

    return (
        <div className="border border-gray-200 shadow-sm rounded-3xl bg-white p-8 mb-8 transition-all">
            <div
                className="flex justify-between items-start mb-6 cursor-pointer select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-start gap-4 flex-1">
                    {/* Checkbox */}
                    <div className={clsx(
                        "shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all mt-1",
                        isCollapsed
                            ? "bg-green-600 border-green-600 shadow-sm"
                            : "bg-white border-gray-300 hover:border-green-500"
                    )}>
                        {isCollapsed && (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>

                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{exercise.name}</h3>
                        {!isCollapsed && (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-green-700 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20 font-bold uppercase tracking-wider">
                                        {exercise.sets} Sets
                                    </span>
                                    <span className="text-gray-500 font-medium">Target: <span className="text-gray-900">{adaptation?.adaptedReps ?? exercise.reps}</span> reps</span>
                                </div>
                                {(adaptation?.isAdapted || isAIAdapted) && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                        <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                                            Adapted for your progress
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {!isCollapsed && history && history.length > 0 && (
                    <div className="text-right text-[10px] text-green-700 font-black tracking-widest uppercase bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                        Past Stats Found
                    </div>
                )}
            </div>

            {!isCollapsed && (
                <>
                    {exercise.note && (
                        <div className="mb-6 text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border-l-2 border-green-500">
                            <span className="text-green-700 font-bold uppercase text-[10px] block mb-1 tracking-widest">Coach&apos;s Note</span>
                            {exercise.note}
                        </div>
                    )}

                    <div className="space-y-4">
                        {currentLogs.map((log, idx) => {
                            const prevSet = history?.[idx] || history?.[history.length - 1];

                            return (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <span className="shrink-0 w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-sm text-gray-500 font-bold">
                                            {idx + 1}
                                        </span>

                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    placeholder={prevSet?.weight || "0"}
                                                    value={log.weight}
                                                    onChange={(e) => handleChange(idx, 'weight', e.target.value)}
                                                    className={clsx(
                                                        "w-full text-center font-bold bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10",
                                                        isSetComplete(log) ? "border-green-300 bg-green-50" : ""
                                                    )}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold uppercase tracking-widest pointer-events-none">
                                                    kg
                                                </span>
                                            </div>

                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    placeholder={prevSet?.reps || "0"}
                                                    value={log.reps}
                                                    onChange={(e) => handleChange(idx, 'reps', e.target.value)}
                                                    className={clsx(
                                                        "w-full text-center font-bold bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10",
                                                        isSetComplete(log) ? "border-green-300 bg-green-50" : ""
                                                    )}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold uppercase tracking-widest pointer-events-none">
                                                    reps
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {prevSet && (prevSet.weight || prevSet.reps) && (
                                        <div className="text-[10px] text-gray-400 text-right pr-6 font-bold uppercase tracking-widest">
                                            Last Time: <span className="text-green-700">{prevSet.weight}kg</span> × <span className="text-green-700">{prevSet.reps}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {previousNote && (
                        <div className="mt-6 text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border-l-2 border-gray-300">
                            <span className="text-gray-500 font-bold uppercase text-[10px] block mb-1 tracking-widest">Last Session Note</span>
                            {previousNote}
                        </div>
                    )}

                    <div className="mt-4">
                        <textarea
                            placeholder="Add a note for this exercise... (e.g. swapped machine, used different grip)"
                            value={initialNote || ""}
                            onChange={(e) => onNoteChange(e.target.value)}
                            rows={2}
                            className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-gray-300 focus:ring-4 focus:ring-gray-200/50 resize-none"
                        />
                    </div>

                </>
            )}
        </div>
    );
};
