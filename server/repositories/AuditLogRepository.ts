import { connectDB } from '@/lib/db';
import { AuditLog, IAuditLogDocument } from '@/server/models/AuditLog';
import { AuditAction } from '@/types';

export class AuditLogRepository {
  async create(data: {
    ticket: string;
    performedBy: string;
    action: AuditAction;
    oldValue?: string;
    newValue?: string;
  }): Promise<IAuditLogDocument> {
    await connectDB();
    const log = new AuditLog(data);
    return log.save() as Promise<IAuditLogDocument>;
  }

  async findByTicket(ticketId: string): Promise<IAuditLogDocument[]> {
    await connectDB();
    return AuditLog.find({ ticket: ticketId })
      .populate('performedBy', 'name email')
      .sort({ createdAt: 1 })
      .lean() as Promise<IAuditLogDocument[]>;
  }
}
