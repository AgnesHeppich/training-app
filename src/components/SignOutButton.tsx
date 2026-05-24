'use client';

import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignOutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleSignOut() {
        setPending(true);
        await authClient.signOut();
        router.push('/auth/sign-in');
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={pending}
            className="mt-2 inline-block text-slate-700 hover:text-slate-500 transition-colors cursor-pointer disabled:opacity-50"
        >
            {pending ? 'Signing out...' : 'Sign Out'}
        </button>
    );
}
