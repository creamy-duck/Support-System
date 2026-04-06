import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TicketService } from '@/server/services/TicketService';
import { CreateTicketSchema, TicketFiltersSchema } from '@/validation/ticket';
import { handleApiError } from '@/lib/errors';
import { checkRateLimit } from '@/lib/rateLimit';

const ticketService = new TicketService();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const filters = TicketFiltersSchema.parse(params);
    const result = await ticketService.getTickets(filters, user.id, user.role);
    return NextResponse.json(result);
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };

    const rateCheck = checkRateLimit(`ticket:${user.id}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = CreateTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 },
      );
    }
    const ticket = await ticketService.createTicket(parsed.data, user.id);
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
