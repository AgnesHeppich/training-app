'use client';

import { useActionState } from 'react';
import { signUpWithEmail } from './actions';
import Link from 'next/link';

export default function SignUpPage() {
    const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 py-1 px-3 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[10px] font-bold tracking-[0.2em] text-[#ff477e] mb-6 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff477e] animate-pulse" />
                        Pull-Up Mastery
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">
                        Start your journey
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Create an account to track your progress</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="Your name"
                                className="block w-full rounded-xl bg-slate-950/50 border border-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-[#ff477e]/50 focus:ring-1 focus:ring-[#ff477e]/30 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="block w-full rounded-xl bg-slate-950/50 border border-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-[#ff477e]/50 focus:ring-1 focus:ring-[#ff477e]/30 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="block w-full rounded-xl bg-slate-950/50 border border-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-[#ff477e]/50 focus:ring-1 focus:ring-[#ff477e]/30 transition-colors"
                            />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                                {state.error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-xl bg-[#ff477e] hover:bg-[#ff6090] disabled:opacity-50 px-4 py-3 text-sm font-black text-white tracking-wide transition-colors shadow-[0_0_20px_rgba(255,71,126,0.3)]"
                        >
                            {isPending ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>

                    <p className="text-center text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link href="/auth/sign-in" className="text-[#ff477e] hover:text-[#ff6090] font-bold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
