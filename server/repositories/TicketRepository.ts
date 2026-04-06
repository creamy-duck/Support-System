import { connectDB } from '@/lib/db';
import { Ticket, ITicketDocument } from '@/server/models/Ticket';
import { TicketFilters, PaginatedResult } from '@/types';

type TicketFilter = Record<string, unknown>;

export class TicketRepository {
  async findById(id: string): Promise<ITicketDocument | null> {
    await connectDB();
    return Ticket.findById(id)
      .populate('createdBy', '-password')
      .populate('assignedTo', '-password')
      .lean() as Promise<ITicketDocument | null>;
  }

  async findPaginated(
    filter: TicketFilter,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<ITicketDocument>> {
    await connectDB();
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Ticket.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Ticket.countDocuments(filter),
    ]);
    return {
      data: data as ITicketDocument[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data: Partial<ITicketDocument>): Promise<ITicketDocument> {
    await connectDB();
    const ticket = new Ticket(data);
    return ticket.save() as Promise<ITicketDocument>;
  }

  async update(id: string, data: Partial<ITicketDocument>): Promise<ITicketDocument | null> {
    await connectDB();
    return Ticket.findByIdAndUpdate(id, data, { new: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean() as Promise<ITicketDocument | null>;
  }

  async buildFilter(
    filters: TicketFilters,
    userId?: string,
    userRole?: string,
  ): Promise<TicketFilter> {
    const query: TicketFilter = {};
    if (userRole === 'user') query.createdBy = userId;
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.category) query.category = filters.category;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.search) query.$text = { $search: filters.search };
    return query;
  }
}
