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
        <div className="backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl bg-white/40 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-[#5c2b2b] mb-1">{exercise.name}</h3>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#ff477e] bg-white/50 px-2 py-0.5 rounded-lg border border-white/50 font-semibold">
                            {exercise.sets} Sets
                        </span>
                        <span className="text-[#8e5e5e]">Target: {exercise.reps} reps</span>
                    </div>
                </div>
                {/* Overall Last Time Summary (Top Right) - Optional now that we have per-set? 
            Let's keep it as a quick summary of the LAST set or Max? 
            Actually, per-set is better. I'll remove the top-right summary to declutter 
            or just show "Last Session" label if history exists. */}
                {history && history.length > 0 && (
                    <div className="text-right text-xs text-[#ff477e] font-medium bg-white/50 px-3 py-1 rounded-full">
                        History Available
                    </div>
                )}
            </div>

            {exercise.note && (
                <div className="mb-4 text-sm text-[#8e5e5e] italic bg-white/30 p-3 rounded-xl border-l-4 border-[#ff477e]">
                    Memo: {exercise.note}
                </div>
            )}

            <div className="space-y-3">
                {currentLogs.map((log, idx) => {
                    // Get specific history for this set index
                    // Fallback to index 0 if specific set history missing (e.g. if we added more sets this week)
                    const prevSet = history?.[idx] || history?.[history.length - 1];

                    return (
                        <div key={idx} className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-sm text-[#5c2b2b] font-bold shadow-sm">
                                    {idx + 1}
                                </span>

                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="relative group">
                                        {/* Floating Label / Suggestion */}
                                        {prevSet && prevSet.weight && (
                                            <div className="absolute -top-3 left-2 bg-[#ff477e] text-white text-[10px] px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-sm">
                                                Prev: {prevSet.weight}kg
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            placeholder={prevSet?.weight || "kg"}
                                            value={log.weight}
                                            onChange={(e) => handleChange(idx, 'weight', e.target.value)}
                                            className={clsx(
                                                "w-full text-center font-mono !bg-white/60 !border-white/50 !text-[#5c2b2b] rounded-xl p-3 outline-none transition-all placeholder:text-[#b08d8d]/50 focus:!border-[#ff477e] focus:ring-2 focus:ring-[#ff477e]/20 shadow-inner",
                                                isSetComplete(log) ? "!bg-green-100/50 !border-green-400/50 !text-green-800" : ""
                                            )}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8e5e5e]/60 pointer-events-none">
                                            kg
                                        </span>
                                    </div>

                                    <div className="relative group">
                                        {/* Floating Label / Suggestion */}
                                        {prevSet && prevSet.reps && (
                                            <div className="absolute -top-3 left-2 bg-[#ff477e] text-white text-[10px] px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-sm">
                                                Prev: {prevSet.reps} reps
                                            </div>
                                        )}
                                        <input
                                            type="number"
                                            placeholder={prevSet?.reps || exercise.reps}
                                            value={log.reps}
                                            onChange={(e) => handleChange(idx, 'reps', e.target.value)}
                                            className={clsx(
                                                "w-full text-center font-mono !bg-white/60 !border-white/50 !text-[#5c2b2b] rounded-xl p-3 outline-none transition-all placeholder:text-[#b08d8d]/50 focus:!border-[#ff477e] focus:ring-2 focus:ring-[#ff477e]/20 shadow-inner",
                                                isSetComplete(log) ? "!bg-green-100/50 !border-green-400/50 !text-green-800" : ""
                                            )}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8e5e5e]/60 pointer-events-none">
                                            reps
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Visible text suggestion below inputs for easier reading without hover? 
                  User said "easier to know". Hover is hidden. Let's make it always visible but subtle. */}
                            {prevSet && (prevSet.weight || prevSet.reps) && (
                                <div className="text-[10px] text-[#ff477e] text-right pr-4 font-mono">
                                    Prev: {prevSet.weight}kg x {prevSet.reps}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
