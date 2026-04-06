import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuditLogRepository } from '@/server/repositories/AuditLogRepository';
import { handleApiError } from '@/lib/errors';

const auditRepo = new AuditLogRepository();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    if (user.role === 'user') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const logs = await auditRepo.findByTicket(id);
    return NextResponse.json({ logs });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
