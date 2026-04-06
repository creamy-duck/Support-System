import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/server/services/UserService';
import { handleApiError } from '@/lib/errors';

const userService = new UserService();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    const { searchParams } = new URL(req.url);
    const supportOnly = searchParams.get('supportOnly') === 'true';
    const users = supportOnly
      ? await userService.getSupportUsers()
      : await userService.getUsers(user.role);
    return NextResponse.json({ users });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
