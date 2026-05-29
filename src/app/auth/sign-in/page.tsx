'use client';

import { useActionState } from 'react';
import { signInWithEmail } from './actions';
import Link from 'next/link';

export default function SignInPage() {
    const [state, formAction, isPending] = useActionState(signInWithEmail, null);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 py-1 px-3 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-bold tracking-[0.2em] text-green-700 mb-6 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                        Antigravity
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Sign in to continue your journey</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="block w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-colors"
                            />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                                {state.error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-3 text-sm font-black text-white tracking-wide transition-colors shadow-sm"
                        >
                            {isPending ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm">
                        No account yet?{' '}
                        <Link href="/auth/sign-up" className="text-green-700 hover:text-green-800 font-bold transition-colors">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
