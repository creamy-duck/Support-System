export type UserRole = 'user' | 'support' | 'admin';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_for_customer' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'technical' | 'billing' | 'general' | 'feature_request' | 'bug';
export type AuditAction = 'status_changed' | 'assigned' | 'unassigned' | 'closed' | 'created' | 'reply_added';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface ITicket {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: IUser | string;
  assignedTo?: IUser | string | null;
  attachments?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketReply {
  _id: string;
  ticket: string;
  author: IUser | string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface IAuditLog {
  _id: string;
  ticket: string;
  performedBy: IUser | string;
  action: AuditAction;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}
