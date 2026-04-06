import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { TicketReply } from '@/server/models/TicketReply';
import { Ticket } from '@/server/models/Ticket';
import { AuditLogRepository } from '@/server/repositories/AuditLogRepository';
import { CreateReplySchema } from '@/validation/reply';
import { handleApiError } from '@/lib/errors';

const auditRepo = new AuditLogRepository();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    await connectDB();
    const ticket = await Ticket.findById(params.id);
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    if (user.role === 'user' && ticket.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const query: Record<string, unknown> = { ticket: params.id };
    if (user.role === 'user') query.isInternal = false;
    const replies = await TicketReply.find(query)
      .populate('author', 'name email role')
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json({ replies });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user as { id: string; role: string };
    await connectDB();
    const ticket = await Ticket.findById(params.id);
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    if (user.role === 'user' && ticket.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const parsed = CreateReplySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 },
      );
    }
    if (user.role === 'user' && parsed.data.isInternal) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const reply = await TicketReply.create({
      ticket: params.id,
      author: user.id,
      ...parsed.data,
    });
    await auditRepo.create({
      ticket: params.id,
      performedBy: user.id,
      action: 'reply_added',
      newValue: parsed.data.isInternal ? 'internal' : 'public',
    });
    const populated = await TicketReply.findById(reply._id)
      .populate('author', 'name email role')
      .lean();
    return NextResponse.json({ reply: populated }, { status: 201 });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
