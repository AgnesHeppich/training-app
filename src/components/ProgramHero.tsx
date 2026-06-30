import { motion } from "framer-motion";
import { NavMenu } from "./NavMenu";

type ProgramHeroProps = {
    name: string;
    description: string;
    totalWeeks: number;
    totalSessions: number;
    completionPct: number;
};

export function ProgramHero({
    name,
    description,
    totalWeeks,
    totalSessions,
    completionPct,
}: ProgramHeroProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
        >
            <div className="flex justify-end mb-4">
                <NavMenu />
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700 mb-2">
                                Active Program
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
                                {name}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto sm:mx-0">
                                {description}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <StatPill label={`${totalWeeks} week${totalWeeks === 1 ? "" : "s"}`} />
                                <StatPill label={`${totalSessions} session${totalSessions === 1 ? "" : "s"}`} />
                                <StatPill
                                    label={`${completionPct}% complete`}
                                    accent={completionPct > 0}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center sm:justify-end shrink-0">
                            <div className="coach-accent">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/coach.png"
                                    alt=""
                                    width={1254}
                                    height={1254}
                                    aria-hidden
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-1 bg-app-track/60">
                    <div
                        className="h-full bg-linear-to-r from-green-600 to-green-400 transition-all duration-700"
                        style={{ width: `${completionPct}%` }}
                    />
                </div>
            </div>
        </motion.header>
    );
}

function StatPill({ label, accent = false }: { label: string; accent?: boolean }) {
    return (
        <span
            className={
                accent
                    ? "inline-flex items-center rounded-full bg-green-50 border border-green-200/80 px-2.5 py-1 text-[11px] font-semibold text-green-700"
                    : "inline-flex items-center rounded-full bg-gray-50 border border-gray-200/80 px-2.5 py-1 text-[11px] font-semibold text-gray-600"
            }
        >
            {label}
        </span>
    );
}
