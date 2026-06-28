'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ExerciseProgressSeries, ExerciseSessionPoint } from '@/hooks/useWorkoutHistory';

type MetricOption = {
    key: string;
    label: string;
    suffix: string;
    get: (p: ExerciseSessionPoint) => number | null;
};

function metricOptions(series: ExerciseProgressSeries): MetricOption[] {
    switch (series.metric) {
        case 'weight':
            return [
                { key: 'maxWeight', label: 'Top set', suffix: 'kg', get: p => p.maxWeight },
                { key: 'totalVolume', label: 'Volume', suffix: 'kg', get: p => p.totalVolume },
                { key: 'maxReps', label: 'Best reps', suffix: '', get: p => p.maxReps },
            ];
        case 'cardio':
            return [{ key: 'cardioValue', label: 'Effort', suffix: '', get: p => p.cardioValue }];
        case 'reps':
        default:
            return [
                { key: 'totalReps', label: 'Total reps', suffix: '', get: p => p.totalReps },
                { key: 'maxReps', label: 'Best set', suffix: '', get: p => p.maxReps },
            ];
    }
}

function fmt(value: number, suffix: string): string {
    const rounded = Math.round(value * 10) / 10;
    const str = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    return suffix ? `${str}${suffix}` : str;
}

type ChartDatum = { value: number; point: ExerciseSessionPoint };

function LineChart({
    data,
    suffix,
    interactive = false,
}: {
    data: ChartDatum[];
    suffix: string;
    interactive?: boolean;
}) {
    const [hovered, setHovered] = useState<number | null>(null);

    const W = 320;
    const H = interactive ? 150 : 52;
    const padL = interactive ? 8 : 4;
    const padR = interactive ? 8 : 4;
    const padT = interactive ? 16 : 8;
    const padB = interactive ? 16 : 8;

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const x = (i: number) =>
        data.length === 1 ? W / 2 : padL + (i * (W - padL - padR)) / (data.length - 1);
    const y = (v: number) => padT + (1 - (v - min) / range) * (H - padT - padB);

    const linePath = data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`)
        .join(' ');
    const areaPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${H - padB} L ${x(0).toFixed(1)} ${H - padB} Z`;

    const gradId = `grad-${Math.random().toString(36).slice(2)}`;

    return (
        <div className="relative w-full">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                className="w-full"
                style={{ height: H }}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <path d={areaPath} fill={`url(#${gradId})`} />
                <path
                    d={linePath}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth={interactive ? 2 : 1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {data.map((d, i) => {
                    const isActive = hovered === i;
                    const isEdge = i === 0 || i === data.length - 1;
                    if (!interactive && !isEdge && data.length > 2) return null;
                    return (
                        <circle
                            key={i}
                            cx={x(i)}
                            cy={y(d.value)}
                            r={isActive ? 4 : interactive ? 3 : 2.5}
                            fill="#ffffff"
                            stroke="#16a34a"
                            strokeWidth={2}
                            vectorEffect="non-scaling-stroke"
                        />
                    );
                })}

                {interactive &&
                    data.map((_, i) => {
                        const half = (W - padL - padR) / Math.max(1, data.length - 1) / 2;
                        const cx = x(i);
                        return (
                            <rect
                                key={`hit-${i}`}
                                x={cx - half}
                                y={0}
                                width={half * 2}
                                height={H}
                                fill="transparent"
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ cursor: 'pointer' }}
                            />
                        );
                    })}
            </svg>

            {interactive && hovered !== null && (
                <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-gray-900 px-2.5 py-1.5 text-center"
                    style={{ left: `${(x(hovered) / W) * 100}%`, top: -6, transform: 'translate(-50%, -100%)' }}
                >
                    <p className="whitespace-nowrap text-[11px] font-black text-white tabular-nums">
                        {fmt(data[hovered].value, suffix)}
                    </p>
                    <p className="whitespace-nowrap text-[9px] font-medium text-gray-300">
                        W{data[hovered].point.week} · {data[hovered].point.dayLabel.slice(0, 3)}
                    </p>
                </div>
            )}
        </div>
    );
}

function ExerciseCard({ series }: { series: ExerciseProgressSeries }) {
    const options = metricOptions(series);
    const [metricKey, setMetricKey] = useState(options[0].key);
    const [expanded, setExpanded] = useState(false);

    const activeOption = options.find(o => o.key === metricKey) ?? options[0];

    const data: ChartDatum[] = series.points
        .map(p => ({ value: activeOption.get(p), point: p }))
        .filter((d): d is ChartDatum => d.value !== null);

    const latest = data[data.length - 1]?.value ?? null;
    const first = data[0]?.value ?? null;
    const delta = latest !== null && first !== null ? latest - first : null;

    return (
        <div className="rounded-2xl bg-white overflow-hidden">
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full text-left px-5 pt-4 pb-3 cursor-pointer hover:bg-gray-50/60 transition-colors"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-snug truncate">{series.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {activeOption.label}
                            {data.length > 0 && ` · ${data.length} session${data.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    {latest !== null && (
                        <div className="shrink-0 text-right">
                            <div className="text-xl font-black text-gray-900 tabular-nums leading-none">
                                {fmt(latest, activeOption.suffix)}
                            </div>
                            {delta !== null && delta !== 0 && (
                                <div
                                    className={clsx(
                                        'text-[10px] font-black tabular-nums mt-1',
                                        delta > 0 ? 'text-green-600' : 'text-orange-500'
                                    )}
                                >
                                    {delta > 0 ? '↑' : '↓'} {fmt(Math.abs(delta), activeOption.suffix)}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    {data.length >= 2 ? (
                        <LineChart data={data} suffix={activeOption.suffix} />
                    ) : data.length === 1 ? (
                        <p className="text-[11px] text-gray-400 py-3">
                            One session logged — complete another to see a trend.
                        </p>
                    ) : (
                        <p className="text-[11px] text-gray-400 py-3">No data logged yet.</p>
                    )}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 py-4">
                            {options.length > 1 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {options.map(o => (
                                        <button
                                            key={o.key}
                                            onClick={() => setMetricKey(o.key)}
                                            className={clsx(
                                                'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors',
                                                o.key === metricKey
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            )}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {data.length >= 2 ? (
                                <>
                                    <LineChart data={data} suffix={activeOption.suffix} interactive />
                                    <div className="mt-4 space-y-1.5">
                                        {[...data].reverse().map((d, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between text-[11px] py-1"
                                            >
                                                <span className="text-gray-500 font-medium">
                                                    Week {d.point.week} · {d.point.dayLabel}
                                                </span>
                                                <span className="font-bold text-gray-900 tabular-nums">
                                                    {fmt(d.value, activeOption.suffix)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-gray-400">
                                    Log at least two sessions of this exercise to chart your trend.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function ExerciseProgress({ series }: { series: ExerciseProgressSeries[] }) {
    const withData = series.filter(s => s.points.length > 0);
    const withoutData = series.filter(s => s.points.length === 0);

    return (
        <section>
            <div className="flex items-baseline justify-between mb-4 px-1">
                <h2 className="text-base font-black text-gray-900 tracking-tight">Exercise Progress</h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Tap a card for details
                </span>
            </div>

            {withData.length === 0 ? (
                <div className="rounded-2xl bg-white px-6 py-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Complete a session and log your sets to start tracking each exercise over time.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {withData.map(s => (
                        <ExerciseCard key={s.name} series={s} />
                    ))}
                </div>
            )}

            {withoutData.length > 0 && (
                <div className="mt-6 px-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                        Not yet logged
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {withoutData.map(s => (
                            <span
                                key={s.name}
                                className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 text-[11px] font-semibold"
                            >
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
