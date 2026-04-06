import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TicketService } from '@/server/services/TicketService';
import { handleApiError } from '@/lib/errors';

const ticketService = new TicketService();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    const ticket = await ticketService.getTicket(id, user.id, user.role);
    return NextResponse.json({ ticket });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
