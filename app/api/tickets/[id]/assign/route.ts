import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TicketService } from '@/server/services/TicketService';
import { AssignTicketSchema } from '@/validation/ticket';
import { handleApiError } from '@/lib/errors';

const ticketService = new TicketService();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    if (user.role === 'user') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const parsed = AssignTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    const ticket = await ticketService.assignTicket(
      params.id,
      parsed.data.assigneeId,
      user.id,
      user.role,
    );
    return NextResponse.json({ ticket });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
