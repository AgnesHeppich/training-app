export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
        redirect('/auth/sign-in');
    }
    return <>{children}</>;
}
