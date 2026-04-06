import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export type SessionUser = { id: string; email: string; name: string; role: string };

export async function requireAuth(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');
  return session.user as SessionUser;
}

export async function requireRole(role: string | string[]): Promise<SessionUser> {
  const user = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) throw new Error('Forbidden');
  return user;
}

export function withAuth(
  handler: (req: Request, user: SessionUser) => Promise<NextResponse>,
) {
  return async (req: Request) => {
    try {
      const user = await requireAuth();
      return handler(req, user);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
