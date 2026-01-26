import { Exercise } from "@/data/program";
import { SetLog } from "@/hooks/useWorkoutHistory";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface ExerciseItemProps {
    exercise: Exercise;
    history?: SetLog[];
    onLogChange: (logs: SetLog[]) => void;
    initialLogs?: SetLog[];
}

export const ExerciseItem = ({ exercise, history, onLogChange, initialLogs }: ExerciseItemProps) => {
    // Controlled component pattern: derive state from props
    // If no logs exist yet, we'll create a temporary array for rendering
    // and trigger an initialization effect to populate parent state with history defaults.

    const [isCollapsed, setIsCollapsed] = useState(false);

    // Ensure we have a valid array of length 'sets'
    const currentLogs = initialLogs || Array(exercise.sets).fill({ weight: "", reps: "" });

    // Initialize defaults from history on mount if no logs exist
    useEffect(() => {
        if (!initialLogs) {
            const defaults = Array(exercise.sets).fill(null).map((_, idx) => {
                return {
                    weight: history?.[idx]?.weight || history?.[0]?.weight || "",
                    reps: ""
                };
            });
            // Only fire if we actually have some defaults to set (prevent empty loop)
            if (defaults.some(d => d.weight !== "")) {
                onLogChange(defaults);
            }
        }
    }, []); // Run once on mount (per exercise instance)

    const handleChange = (index: number, field: keyof SetLog, value: string) => {
        const newLogs = [...currentLogs];
        // Ensure object exists at index if it was a sparse array/undefined (shoudln't be with current logic but safe)
        if (!newLogs[index]) newLogs[index] = { weight: "", reps: "" };

        newLogs[index] = { ...newLogs[index], [field]: value };
        onLogChange(newLogs);
    };

    const isSetComplete = (log: SetLog) => log.weight !== "" && log.reps !== "";

    return (
        <div className="backdrop-blur-xl border border-slate-800/60 shadow-2xl rounded-3xl bg-slate-900/60 p-8 mb-8 transition-all">
            <div
                className="flex justify-between items-start mb-6 cursor-pointer select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-start gap-4 flex-1">
                    {/* Checkbox */}
                    <div className={clsx(
                        "flex-shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all mt-1",
                        isCollapsed
                            ? "bg-[#ff477e] border-[#ff477e] shadow-[0_0_15px_rgba(255,71,126,0.4)]"
                            : "bg-slate-950/50 border-slate-700 hover:border-[#ff477e]"
                    )}>
                        {isCollapsed && (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>

                    <div>
                        <h3 className="text-2xl font-black text-white mb-2">{exercise.name}</h3>
                        {!isCollapsed && (
                            <div className="flex items-center gap-4 text-xs">
                                <span className="text-[#ff477e] bg-pink-500/10 px-3 py-1 rounded-lg border border-pink-500/20 font-bold uppercase tracking-wider">
                                    {exercise.sets} Sets
                                </span>
                                <span className="text-slate-400 font-medium">Target: <span className="text-slate-200">{exercise.reps}</span> reps</span>
                            </div>
                        )}
                    </div>
                </div>
                {!isCollapsed && history && history.length > 0 && (
                    <div className="text-right text-[10px] text-[#ff477e] font-black tracking-widest uppercase bg-[#ff477e]/10 px-3 py-1.5 rounded-full border border-[#ff477e]/20">
                        Past Stats Found
                    </div>
                )}
            </div>

            {!isCollapsed && (
                <>
                    {exercise.note && (
                        <div className="mb-6 text-sm text-slate-400 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border-l-2 border-[#ff477e]">
                            <span className="text-[#ff477e] font-bold uppercase text-[10px] block mb-1 tracking-widest">Coach's Note</span>
                            {exercise.note}
                        </div>
                    )}

                    <div className="space-y-4">
                        {currentLogs.map((log, idx) => {
                            const prevSet = history?.[idx] || history?.[history.length - 1];

                            return (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-center text-sm text-slate-400 font-bold">
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
                                                        "w-full text-center font-bold bg-slate-950/50 border border-slate-800 text-white rounded-2xl p-4 outline-none transition-all placeholder:text-slate-700 focus:border-[#ff477e] focus:ring-4 focus:ring-[#ff477e]/10",
                                                        isSetComplete(log) ? "border-[#ff477e]/40 bg-[#ff477e]/5 shadow-[0_0_20px_rgba(255,71,126,0.05)]" : ""
                                                    )}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-widest pointer-events-none">
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
                                                        "w-full text-center font-bold bg-slate-950/50 border border-slate-800 text-white rounded-2xl p-4 outline-none transition-all placeholder:text-slate-700 focus:border-[#ff477e] focus:ring-4 focus:ring-[#ff477e]/10",
                                                        isSetComplete(log) ? "border-[#ff477e]/40 bg-[#ff477e]/5 shadow-[0_0_20px_rgba(255,71,126,0.05)]" : ""
                                                    )}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-widest pointer-events-none">
                                                    reps
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {prevSet && (prevSet.weight || prevSet.reps) && (
                                        <div className="text-[10px] text-slate-500 text-right pr-6 font-bold uppercase tracking-widest">
                                            Last Time: <span className="text-[#ff477e]">{prevSet.weight}kg</span> × <span className="text-[#ff477e]">{prevSet.reps}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};
