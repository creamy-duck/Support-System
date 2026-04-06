import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/server/services/UserService';
import { z } from 'zod';
import { handleApiError } from '@/lib/errors';

const userService = new UserService();
const UpdateRoleSchema = z.object({ role: z.enum(['user', 'support', 'admin']) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const requester = session.user as { id: string; role: string };
    const body = await req.json();
    const parsed = UpdateRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    const updated = await userService.updateRole(params.id, parsed.data.role, requester.role);
    return NextResponse.json({ user: updated });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
