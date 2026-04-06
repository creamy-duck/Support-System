import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TicketService } from '@/server/services/TicketService';
import { UserService } from '@/server/services/UserService';
import { AuditLogRepository } from '@/server/repositories/AuditLogRepository';
import { connectDB } from '@/lib/db';
import { TicketReply } from '@/server/models/TicketReply';
import { TicketDetail } from '@/components/tickets/TicketDetail';
import { ReplyList } from '@/components/tickets/ReplyList';
import { ReplyForm } from '@/components/tickets/ReplyForm';
import { AuditLogList } from '@/components/tickets/AuditLogList';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ITicket, ITicketReply, IAuditLog } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface PageProps {
  params: { id: string };
}

export default async function TicketDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const user = session.user as { id: string; role: string };

  const ticketService = new TicketService();
  const userService = new UserService();
  const auditRepo = new AuditLogRepository();

  let ticket;
  try {
    ticket = await ticketService.getTicket(params.id, user.id, user.role);
  } catch {
    notFound();
  }

  await connectDB();

  const repliesQuery: Record<string, unknown> = { ticket: params.id };
  if (user.role === 'user') repliesQuery.isInternal = false;

  const [replies, auditLogs, supportUsers] = await Promise.all([
    TicketReply.find(repliesQuery)
      .populate('author', 'name email role')
      .sort({ createdAt: 1 })
      .lean(),
    user.role !== 'user' ? auditRepo.findByTicket(params.id) : Promise.resolve([]),
    user.role !== 'user' ? userService.getSupportUsers() : Promise.resolve([]),
  ]);

  const supportUserList = supportUsers.map((u) => ({
    _id: (u as { _id: { toString(): string } })._id.toString(),
    name: (u as { name: string }).name,
  }));

  return (
    <div className="space-y-6">
      <Link href="/tickets" className="text-sm text-blue-600 hover:underline">
        ← Back to tickets
      </Link>

      <Card>
        <CardContent className="pt-6">
          <TicketDetail
            ticket={ticket as unknown as ITicket}
            supportUsers={supportUserList}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Replies</h2>
        </CardHeader>
        <CardContent>
          <ReplyList replies={replies as unknown as ITicketReply[]} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Add Reply</h2>
        </CardHeader>
        <CardContent>
          <ReplyForm ticketId={params.id} />
        </CardContent>
      </Card>

      {user.role !== 'user' && auditLogs.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
          </CardHeader>
          <CardContent>
            <AuditLogList logs={auditLogs as unknown as IAuditLog[]} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
