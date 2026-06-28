'use client';

import { motion } from 'framer-motion';

interface ProgramMasteryProps {
    completedSessions: number;
    totalSessions: number;
    weeksMastered: number;
}

export function ProgramMastery({ completedSessions, totalSessions, weeksMastered }: ProgramMasteryProps) {
    const percent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return (
        <div className="p-8 rounded-3xl bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Overall Program Mastery</span>
                        <span className="text-sm font-black text-green-700">{percent}%</span>
                    </div>
                    <div className="h-2 bg-app-track rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-linear-to-r from-green-600 to-green-400"
                        />
                    </div>
                </div>
                <div className="flex gap-8 md:pl-8">
                    <div>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Sessions Done</span>
                        <span className="text-3xl font-black text-gray-900">{completedSessions}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Weeks Mastered</span>
                        <span className="text-3xl font-black text-gray-900">{weeksMastered}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
