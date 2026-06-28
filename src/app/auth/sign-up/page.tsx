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
                    <div className="inline-flex items-center gap-2 py-1 px-3 rounded-lg bg-green-500/10 text-[10px] font-bold tracking-[0.2em] text-green-700 mb-6 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                        Workout buddy
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
                        Start your journey
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Create an account to track your progress</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="rounded-3xl bg-white shadow-sm p-6 space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="Your name"
                                className="block w-full rounded-xl bg-gray-50 border-0 px-4 py-3 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-colors"
                            />
                        </div>
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
                                className="block w-full rounded-xl bg-gray-50 border-0 px-4 py-3 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-colors"
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
                                className="block w-full rounded-xl bg-gray-50 border-0 px-4 py-3 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-colors"
                            />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                                {state.error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-3 text-sm font-black text-white tracking-wide transition-colors"
                        >
                            {isPending ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm">
                        Already have an account?{' '}
                        <Link href="/auth/sign-in" className="text-green-700 hover:text-green-800 font-bold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
