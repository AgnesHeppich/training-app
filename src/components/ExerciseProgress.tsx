'use client';

import { useState, useRef, useEffect } from 'react';
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

const CHART_W = 320;
const CHART_H = 150;
const CHART_H_COMPACT = 52;

function LineChart({
    data,
    suffix,
    expanded = false,
}: {
    data: ChartDatum[];
    suffix: string;
    expanded?: boolean;
}) {
    const [hovered, setHovered] = useState<number | null>(null);

    const padL = expanded ? 8 : 4;
    const padR = expanded ? 8 : 4;
    const padT = expanded ? 16 : 8;
    const padB = expanded ? 16 : 8;

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const x = (i: number) =>
        data.length === 1 ? CHART_W / 2 : padL + (i * (CHART_W - padL - padR)) / (data.length - 1);
    const y = (v: number) => padT + (1 - (v - min) / range) * (CHART_H - padT - padB);

    const linePath = data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`)
        .join(' ');
    const areaPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${CHART_H - padB} L ${x(0).toFixed(1)} ${CHART_H - padB} Z`;

    const gradId = `grad-${data.map(d => d.value).join('-')}`;

    return (
        <motion.div
            className="relative w-full overflow-hidden"
            animate={{ height: expanded ? CHART_H : CHART_H_COMPACT }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
            <svg
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                preserveAspectRatio="none"
                className="w-full h-full"
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
                    strokeWidth={expanded ? 2 : 1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                {data.map((d, i) => {
                    const isActive = hovered === i;
                    const isEdge = i === 0 || i === data.length - 1;
                    if (!expanded && !isEdge && data.length > 2) return null;
                    return (
                        <circle
                            key={i}
                            cx={x(i)}
                            cy={y(d.value)}
                            r={isActive ? 4 : expanded ? 3 : 2.5}
                            fill="#ffffff"
                            stroke="#16a34a"
                            strokeWidth={2}
                            vectorEffect="non-scaling-stroke"
                        />
                    );
                })}

                {expanded &&
                    data.map((_, i) => {
                        const half = (CHART_W - padL - padR) / Math.max(1, data.length - 1) / 2;
                        const cx = x(i);
                        return (
                            <rect
                                key={`hit-${i}`}
                                x={cx - half}
                                y={0}
                                width={half * 2}
                                height={CHART_H}
                                fill="transparent"
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ cursor: 'pointer' }}
                            />
                        );
                    })}
            </svg>

            {expanded && hovered !== null && (
                <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-gray-900 px-2.5 py-1.5 text-center"
                    style={{
                        left: `${(x(hovered) / CHART_W) * 100}%`,
                        top: -6,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <p className="whitespace-nowrap text-[11px] font-black text-white tabular-nums">
                        {fmt(data[hovered].value, suffix)}
                    </p>
                    <p className="whitespace-nowrap text-[9px] font-medium text-gray-300">
                        W{data[hovered].point.week} · {data[hovered].point.dayLabel.slice(0, 3)}
                    </p>
                </div>
            )}
        </motion.div>
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
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full text-left px-5 pt-4 pb-2 cursor-pointer hover:bg-gray-50/60 transition-colors"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-gray-900 leading-snug truncate">{series.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {activeOption.label}
                            {data.length > 0 && ` · ${data.length} session${data.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <div className="shrink-0 flex items-start gap-2">
                        {latest !== null && (
                            <div className="text-right">
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
                        <svg
                            className={clsx(
                                'w-4 h-4 text-gray-300 mt-1 transition-transform duration-300',
                                expanded && 'rotate-180'
                            )}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>
            </button>

            <div className="px-5 pb-3">
                {data.length >= 2 ? (
                    <LineChart data={data} suffix={activeOption.suffix} expanded={expanded} />
                ) : data.length === 1 ? (
                    <p className="text-[11px] text-gray-400 py-3">
                        One session logged — complete another to see a trend.
                    </p>
                ) : (
                    <p className="text-[11px] text-gray-400 py-3">No data logged yet.</p>
                )}
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-4">
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
                                <div className="space-y-1.5">
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

function PinIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
    );
}

function CustomizeSheet({
    series,
    draft,
    onDraftChange,
    onDone,
    onClose,
}: {
    series: ExerciseProgressSeries[];
    draft: string[];
    onDraftChange: (names: string[]) => void;
    onDone: () => void;
    onClose: () => void;
}) {
    const [search, setSearch] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTimeout(() => searchRef.current?.focus(), 150);
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const filtered = series.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (name: string) => {
        if (draft.includes(name)) {
            onDraftChange(draft.filter(n => n !== name));
        } else {
            onDraftChange([...draft, name]);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={onClose}
            />
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80dvh] flex flex-col"
            >
                <div className="flex justify-center pt-3 pb-2 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                <div className="px-5 pb-3 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-gray-900">Pin exercises</h3>
                        <button
                            onClick={onDone}
                            className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search exercises…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                    <p className="text-[10px] text-gray-400 font-medium mt-2">
                        {draft.length === 0
                            ? 'No exercises pinned — all logged exercises will be shown.'
                            : `${draft.length} pinned — others hidden until you expand.`}
                    </p>
                </div>

                <div className="overflow-y-auto flex-1 px-5 pb-8 space-y-1">
                    {filtered.map(s => {
                        const isPinned = draft.includes(s.name);
                        const hasData = s.points.length > 0;
                        return (
                            <button
                                key={s.name}
                                onClick={() => toggle(s.name)}
                                className={clsx(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                                    isPinned ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
                                )}
                            >
                                <div
                                    className={clsx(
                                        'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                                        isPinned
                                            ? 'bg-green-600 border-green-600'
                                            : 'border-gray-300 bg-white'
                                    )}
                                >
                                    {isPinned && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {hasData
                                            ? `${s.points.length} session${s.points.length !== 1 ? 's' : ''} logged`
                                            : 'Not yet logged'}
                                    </p>
                                </div>
                                {isPinned && <PinIcon className="text-green-600 shrink-0" />}
                            </button>
                        );
                    })}
                    {filtered.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">No exercises match your search.</p>
                    )}
                </div>
            </motion.div>
        </>
    );
}

function ExerciseGrid({ items }: { items: ExerciseProgressSeries[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(s => (
                <ExerciseCard key={s.name} series={s} />
            ))}
        </div>
    );
}

export function ExerciseProgress({
    series,
    progressPriorities,
    onProgressPrioritiesChange,
}: {
    series: ExerciseProgressSeries[];
    progressPriorities: string[];
    onProgressPrioritiesChange: (names: string[]) => void;
}) {
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const [draftPriorities, setDraftPriorities] = useState<string[]>(progressPriorities);
    const [showOthers, setShowOthers] = useState(false);

    const withData = series.filter(s => s.points.length > 0);
    const withoutData = series.filter(s => s.points.length === 0);
    const hasPriorities = progressPriorities.length > 0;

    const pinnedWithData = hasPriorities
        ? progressPriorities
              .map(name => withData.find(s => s.name === name))
              .filter((s): s is ExerciseProgressSeries => s !== undefined)
        : withData;

    const otherWithData = hasPriorities
        ? withData.filter(s => !progressPriorities.includes(s.name))
        : [];

    const openCustomize = () => {
        setDraftPriorities(progressPriorities);
        setCustomizeOpen(true);
    };

    const handleDone = () => {
        onProgressPrioritiesChange(draftPriorities);
        setCustomizeOpen(false);
        setShowOthers(false);
    };

    return (
        <section>
            <div className="flex items-baseline justify-between mb-4 px-1 gap-3">
                <h2 className="text-base font-black text-gray-900 tracking-tight">Exercise Progress</h2>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={openCustomize}
                        className="text-[10px] text-green-600 font-black uppercase tracking-widest hover:text-green-700 transition-colors"
                    >
                        Customize
                    </button>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:inline">
                        Tap a card for details
                    </span>
                </div>
            </div>

            {withData.length === 0 ? (
                <div className="rounded-2xl bg-white shadow-sm px-6 py-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Complete a session and log your sets to start tracking each exercise over time.
                    </p>
                </div>
            ) : (
                <>
                    <ExerciseGrid items={pinnedWithData} />

                    {otherWithData.length > 0 && (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowOthers(v => !v)}
                                className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg
                                    className={clsx(
                                        'w-3 h-3 transition-transform duration-200',
                                        showOthers && 'rotate-180'
                                    )}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                                {showOthers
                                    ? 'Hide other exercises'
                                    : `Show ${otherWithData.length} other exercise${otherWithData.length !== 1 ? 's' : ''}`}
                            </button>
                            <AnimatePresence initial={false}>
                                {showOthers && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3">
                                            <ExerciseGrid items={otherWithData} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            )}

            {withoutData.length > 0 && (
                <div className="mt-6 px-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                        Not yet logged
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {withoutData.map(s => {
                            const isPinned = progressPriorities.includes(s.name);
                            return (
                                <span
                                    key={s.name}
                                    className={clsx(
                                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold',
                                        isPinned
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-400'
                                    )}
                                >
                                    {isPinned && <PinIcon className="text-green-600" />}
                                    {s.name}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {customizeOpen && (
                    <CustomizeSheet
                        series={series}
                        draft={draftPriorities}
                        onDraftChange={setDraftPriorities}
                        onDone={handleDone}
                        onClose={() => setCustomizeOpen(false)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
