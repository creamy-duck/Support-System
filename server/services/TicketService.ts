import { TicketRepository } from '@/server/repositories/TicketRepository';
import { AuditLogRepository } from '@/server/repositories/AuditLogRepository';
import { TicketFilters, PaginatedResult, TicketStatus } from '@/types';
import { ITicketDocument } from '@/server/models/Ticket';

const ticketRepo = new TicketRepository();
const auditRepo = new AuditLogRepository();

export class TicketService {
  async getTickets(
    filters: TicketFilters,
    userId: string,
    userRole: string,
  ): Promise<PaginatedResult<ITicketDocument>> {
    const query = await ticketRepo.buildFilter(filters, userId, userRole);
    return ticketRepo.findPaginated(query, filters.page ?? 1, filters.limit ?? 20);
  }

  async getTicket(id: string, userId: string, userRole: string): Promise<ITicketDocument> {
    const ticket = await ticketRepo.findById(id);
    if (!ticket) throw new Error('Ticket not found');
    if (userRole === 'user') {
      const createdBy = ticket.createdBy as unknown;
      const createdById =
        typeof createdBy === 'object' && createdBy !== null
          ? ((createdBy as { _id?: { toString(): string } })._id?.toString() ?? (createdBy as { toString(): string }).toString())
          : String(createdBy);
      if (createdById !== userId) throw new Error('Forbidden');
    }
    return ticket;
  }

  async createTicket(
    data: Pick<ITicketDocument, 'title' | 'description' | 'priority' | 'category'>,
    userId: string,
  ): Promise<ITicketDocument> {
    const ticket = await ticketRepo.create({
      ...data,
      createdBy: userId as unknown as ITicketDocument['createdBy'],
      status: 'open',
    });
    await auditRepo.create({
      ticket: ticket._id.toString(),
      performedBy: userId,
      action: 'created',
      newValue: 'open',
    });
    return ticket;
  }

  async updateStatus(
    ticketId: string,
    newStatus: TicketStatus,
    userId: string,
    userRole: string,
  ): Promise<ITicketDocument> {
    if (userRole === 'user') throw new Error('Forbidden');
    const ticket = await ticketRepo.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    const oldStatus = ticket.status;
    const updated = await ticketRepo.update(ticketId, { status: newStatus });
    if (!updated) throw new Error('Update failed');
    const action = newStatus === 'closed' ? 'closed' : 'status_changed';
    await auditRepo.create({
      ticket: ticketId,
      performedBy: userId,
      action,
      oldValue: oldStatus,
      newValue: newStatus,
    });
    return updated;
  }

  async assignTicket(
    ticketId: string,
    assigneeId: string | null,
    userId: string,
    userRole: string,
  ): Promise<ITicketDocument> {
    if (userRole === 'user') throw new Error('Forbidden');
    const ticket = await ticketRepo.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    const oldAssignee = ticket.assignedTo ? ticket.assignedTo.toString() : 'none';
    const updated = await ticketRepo.update(ticketId, {
      assignedTo: assigneeId as unknown as ITicketDocument['assignedTo'],
    });
    if (!updated) throw new Error('Update failed');
    const action = assigneeId ? 'assigned' : 'unassigned';
    await auditRepo.create({
      ticket: ticketId,
      performedBy: userId,
      action,
      oldValue: oldAssignee,
      newValue: assigneeId ?? 'none',
    });
    return updated;
  }
}
