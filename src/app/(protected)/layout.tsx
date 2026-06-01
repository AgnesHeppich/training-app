export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { WorkoutDataProvider } from '@/contexts/WorkoutDataContext';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
        redirect('/auth/sign-in');
    }
    return <WorkoutDataProvider>{children}</WorkoutDataProvider>;
}
