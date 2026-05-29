'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ProgramMeta } from '@/hooks/useProgram';

type ProgramWithEnrollment = ProgramMeta & {
  enrollment: {
    status: string;
    started_at: string;
    completed_at: string | null;
  } | null;
};

type SessionUser = {
  id: string;
  email?: string;
  name?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [programs, setPrograms] = useState<ProgramWithEnrollment[]>([]);
  const [completionMap, setCompletionMap] = useState<Record<number, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    (async () => {
      const [sessionResult, programsRes] = await Promise.all([
        authClient.getSession(),
        fetch('/api/programs'),
      ]);
      if (sessionResult?.data?.user) {
        setUser(sessionResult.data.user as SessionUser);
      }
      const programsData: ProgramWithEnrollment[] = await programsRes.json();
      setPrograms(programsData);

      // Fetch completion counts for all enrolled programs in parallel
      const enrolled = programsData.filter(p => p.enrollment !== null);
      const histories = await Promise.all(
        enrolled.map(p => fetch(`/api/history?programId=${p.id}`).then(r => r.json()))
      );
      const map: Record<number, number> = {};
      enrolled.forEach((p, i) => {
        const completed: number = histories[i]?.completedWorkouts?.length ?? 0;
        map[p.id] = p.workout_count > 0 ? Math.round((completed / p.workout_count) * 100) : 0;
      });
      setCompletionMap(map);

      setIsLoaded(true);
    })();
  }, []);

  async function handleExport() {
    setIsExporting(true);
    try {
      const [histRes, progRes] = await Promise.all([fetch('/api/history'), fetch('/api/program')]);
      const historyData = await histRes.json();
      const programData = await progRes.json();
      const exportData = {
        exportedAt: new Date().toISOString(),
        workoutHistory: historyData,
        programCustomizations: programData.overrides,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.push('/auth/sign-in');
  }

  const activePrograms = programs.filter(p => p.enrollment?.status === 'active');
  const completedPrograms = programs.filter(p => p.enrollment?.status === 'completed');

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#ff477e] font-bold text-xl animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-[0.2em] transition-colors mb-8"
        >
          ← Back
        </Link>
        <h1 className="text-4xl font-black tracking-tight text-white">Profile</h1>
      </motion.div>

      {/* Account Details */}
      <Section title="Account" delay={0.05}>
        <div className="space-y-3">
          <Field label="Email" value={user?.email ?? '—'} />
          {user?.name && <Field label="Name" value={user.name} />}
          <Field label="User ID" value={user?.id ? `${user.id.slice(0, 8)}…` : '—'} mono />
        </div>
      </Section>

      {/* Active Program */}
      <Section title="Active Program" delay={0.1}>
        {activePrograms.length === 0 ? (
          <p className="text-slate-500 text-sm">No active program.</p>
        ) : (
          <div className="space-y-3">
            {activePrograms.map(p => (
              <ProgramCard key={p.id} program={p} badge="active" completion={completionMap[p.id]} />
            ))}
          </div>
        )}
      </Section>

      {/* Completed Programs */}
      <Section title="Completed Programs" delay={0.15}>
        {completedPrograms.length === 0 ? (
          <p className="text-slate-500 text-sm">No completed programs yet. Keep going!</p>
        ) : (
          <div className="space-y-3">
            {completedPrograms.map(p => (
              <ProgramCard key={p.id} program={p} badge="completed" completion={completionMap[p.id]} />
            ))}
          </div>
        )}
      </Section>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 space-y-3"
      >
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl px-6 py-4 text-left flex items-center justify-between group hover:border-slate-700/60 transition-colors disabled:opacity-50"
        >
          <div>
            <p className="text-white font-bold text-sm">Download Data</p>
            <p className="text-slate-500 text-xs mt-0.5">Export all workout history as JSON</p>
          </div>
          <span className="text-[#ff477e] text-lg">{isExporting ? '…' : '↓'}</span>
        </button>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl px-6 py-4 text-left flex items-center justify-between group hover:border-red-900/40 transition-colors disabled:opacity-50"
        >
          <div>
            <p className="text-red-400 font-bold text-sm">{isSigningOut ? 'Signing out…' : 'Sign Out'}</p>
            <p className="text-slate-500 text-xs mt-0.5">You can always sign back in</p>
          </div>
          <span className="text-red-500 text-lg">→</span>
        </button>
      </motion.div>
    </div>
  );
}

function Section({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">{title}</h2>
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl p-5">
        {children}
      </div>
    </motion.div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em]">{label}</span>
      <span className={`text-white text-sm font-semibold ${mono ? 'font-mono text-xs text-slate-400' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function ProgramCard({ program, badge, completion }: { program: ProgramWithEnrollment; badge: 'active' | 'completed'; completion?: number }) {
  const badgeStyles = {
    active: 'bg-pink-500/10 border-pink-500/20 text-[#ff477e]',
    completed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  const startDate = program.enrollment?.started_at
    ? new Date(program.enrollment.started_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  const completedDate = program.enrollment?.completed_at
    ? new Date(program.enrollment.completed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  const pct = completion ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">{program.name}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {program.workout_count} sessions
            {startDate && ` · Started ${startDate}`}
            {completedDate && ` · Completed ${completedDate}`}
          </p>
        </div>
        <span className={`shrink-0 inline-flex items-center py-0.5 px-2 rounded-md border text-[10px] font-black uppercase tracking-[0.15em] ${badgeStyles[badge]}`}>
          {badge === 'active' && <span className="w-1 h-1 rounded-full bg-[#ff477e] animate-pulse mr-1.5" />}{badge}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-950/50 rounded-full overflow-hidden border border-slate-800/50">
          <div
            className={`h-full rounded-full ${badge === 'completed' ? 'bg-emerald-500' : 'bg-linear-to-r from-[#ff477e] to-[#ff9eb5]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-black tabular-nums ${badge === 'completed' ? 'text-emerald-400' : 'text-[#ff477e]'}`}>
          {pct}%
        </span>
      </div>
    </div>
  );
}
