import { Exercise } from "@/data/program";
import { AdaptedTarget, ExerciseLogType, SetLog } from "@/hooks/useWorkoutHistory";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface ExerciseItemProps {
    exercise: Exercise;
    workoutId: string;
    logType: ExerciseLogType;
    onLogTypeChange: (type: ExerciseLogType) => void;
    history?: SetLog[];
    previousLogType?: ExerciseLogType;
    onLogChange: (logs: SetLog[]) => void;
    initialLogs?: SetLog[];
    adaptation?: AdaptedTarget;
    isAIAdapted?: boolean;
    previousNote?: string;
    initialNote?: string;
    onNoteChange: (note: string) => void;
}

export const ExerciseItem = ({ exercise, workoutId, logType, onLogTypeChange, history, previousLogType, onLogChange, initialLogs, adaptation, isAIAdapted, previousNote, initialNote, onNoteChange }: ExerciseItemProps) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            const stored = localStorage.getItem(`workout-checked-${workoutId}`);
            if (stored) {
                const map = JSON.parse(stored);
                return map[exercise.name] ?? false;
            }
        } catch {}
        return false;
    });
    const isCardio = logType === 'cardio';
    const showCardioHistory = previousLogType ? previousLogType === 'cardio' : isCardio;

    const currentLogs = initialLogs || Array(exercise.sets).fill({ weight: "", reps: "" });

    useEffect(() => {
        try {
            const key = `workout-checked-${workoutId}`;
            const stored = localStorage.getItem(key);
            const map = stored ? JSON.parse(stored) : {};
            map[exercise.name] = isCollapsed;
            localStorage.setItem(key, JSON.stringify(map));
        } catch {}
    }, [isCollapsed, workoutId, exercise.name]);

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

    const isSetComplete = (log: SetLog) => {
        if (isCardio) return log.weight !== "";
        return log.weight !== "" && log.reps !== "";
    };

    const toggleLogType = () => onLogTypeChange(isCardio ? 'strength' : 'cardio');

    const targetLabel = adaptation?.isAdapted && adaptation.adaptedReps !== exercise.reps
        ? (
            <>
                <span className="line-through text-gray-400 mr-1">{exercise.reps}</span>
                {adaptation.adaptedReps}
            </>
        )
        : (adaptation?.adaptedReps ?? exercise.reps);

    return (
        <div className={clsx(
            "border border-gray-200 shadow-sm rounded-2xl bg-white mb-6 transition-all",
            isCollapsed ? "p-5" : "p-6"
        )}>
            <div
                className={clsx(
                    "flex items-start gap-4 cursor-pointer select-none",
                    !isCollapsed && "mb-5"
                )}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className={clsx(
                    "shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all mt-1",
                    isCollapsed
                        ? "bg-green-600 border-green-600"
                        : "bg-white border-gray-300 hover:border-green-500"
                )}>
                    {isCollapsed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className={clsx(
                        "text-gray-900 leading-snug",
                        isCollapsed ? "text-lg font-bold" : "text-xl font-bold"
                    )}>
                        {exercise.name}
                    </h3>

                    {!isCollapsed && (
                        <p
                            className="mt-1.5 text-sm text-gray-500"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={toggleLogType}
                                className={clsx(
                                    "font-semibold capitalize hover:underline",
                                    isCardio ? "text-blue-600" : "text-green-700"
                                )}
                            >
                                {logType}
                            </button>
                            {' · '}
                            {exercise.sets} {isCardio ? 'intervals' : 'sets'}
                            {' · '}
                            target {targetLabel}
                            {!isCardio && ' reps'}
                            {history && history.length > 0 && (
                                <span className="text-gray-400"> · past stats</span>
                            )}
                        </p>
                    )}
                    {!isCollapsed && adaptation?.isAdapted && (
                        <p className="mt-1 text-xs text-blue-600">{adaptation.reason}</p>
                    )}
                    {!isCollapsed && isAIAdapted && (
                        <p className="mt-1 text-xs text-amber-600">Updated by AI coach</p>
                    )}
                </div>
            </div>

            {!isCollapsed && (
                <>
                    {exercise.note && (
                        <div className="mb-5 flex bg-green-50">
                            <div className="w-1.5 shrink-0 bg-green-600" />
                            <div className="px-4 py-3">
                                <span className="text-green-700 font-bold uppercase text-[10px] block mb-1 tracking-wider">Coach&apos;s Note</span>
                                <p className="text-gray-600 italic text-sm leading-relaxed">{exercise.note}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {currentLogs.map((log, idx) => {
                            const prevSet = history?.[idx] || history?.[history.length - 1];

                            return (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm text-green-700 font-semibold">
                                            {idx + 1}
                                        </span>

                                        <div className={clsx("flex-1 grid gap-3", isCardio ? "grid-cols-1" : "grid-cols-2")}>
                                            {isCardio ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder={prevSet?.weight || "0"}
                                                        value={log.weight}
                                                        onChange={(e) => handleChange(idx, 'weight', e.target.value)}
                                                        className={clsx(
                                                            "w-full text-center font-semibold bg-gray-50 border-0 text-gray-900 rounded-xl py-3 px-4 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20",
                                                            isSetComplete(log) && "bg-green-50 ring-1 ring-green-200"
                                                        )}
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                                                        time
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder={prevSet?.weight || "0"}
                                                            value={log.weight}
                                                            onChange={(e) => handleChange(idx, 'weight', e.target.value)}
                                                            className={clsx(
                                                                "w-full text-center font-semibold bg-gray-50 border-0 text-gray-900 rounded-xl py-3 px-4 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20",
                                                                isSetComplete(log) && "bg-green-50 ring-1 ring-green-200"
                                                            )}
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                                                            kg
                                                        </span>
                                                    </div>

                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder={prevSet?.reps || "0"}
                                                            value={log.reps}
                                                            onChange={(e) => handleChange(idx, 'reps', e.target.value)}
                                                            className={clsx(
                                                                "w-full text-center font-semibold bg-gray-50 border-0 text-gray-900 rounded-xl py-3 px-4 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20",
                                                                isSetComplete(log) && "bg-green-50 ring-1 ring-green-200"
                                                            )}
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                                                            reps
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {prevSet && (prevSet.weight || prevSet.reps) && (
                                        <div className="text-xs text-gray-400 text-right pr-2">
                                            {showCardioHistory
                                                ? <>Last time: <span className="text-blue-600">{prevSet.weight}</span></>
                                                : <>Last time: <span className="text-green-700">{prevSet.weight}kg</span> × <span className="text-green-700">{prevSet.reps}</span></>
                                            }
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {previousNote && (
                        <div className="mt-5 text-sm text-gray-600 leading-relaxed bg-gray-50 px-4 py-3 rounded-xl border-l-4 border-gray-300">
                            <span className="text-gray-500 font-bold uppercase text-[10px] block mb-1 tracking-wider">Last Session Note</span>
                            <p className="italic">{previousNote}</p>
                        </div>
                    )}

                    <div className="mt-4">
                        <textarea
                            placeholder="Add a note for this exercise... (e.g. swapped machine, used different grip)"
                            value={initialNote || ""}
                            onChange={(e) => onNoteChange(e.target.value)}
                            rows={2}
                            className="w-full text-sm bg-gray-50 border-0 text-gray-900 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/20 resize-none"
                        />
                    </div>
                </>
            )}
        </div>
    );
};
