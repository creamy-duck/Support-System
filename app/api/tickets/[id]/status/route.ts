import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TicketService } from '@/server/services/TicketService';
import { UpdateStatusSchema } from '@/validation/ticket';
import { handleApiError } from '@/lib/errors';

const ticketService = new TicketService();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    const body = await req.json();
    const parsed = UpdateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 },
      );
    }
    const ticket = await ticketService.updateStatus(params.id, parsed.data.status, user.id, user.role);
    return NextResponse.json({ ticket });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
