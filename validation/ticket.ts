import { z } from 'zod';

export const CreateTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['technical', 'billing', 'general', 'feature_request', 'bug']),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'waiting_for_customer', 'closed']),
});

export const AssignTicketSchema = z.object({
  assigneeId: z.string().nullable(),
});

export const TicketFiltersSchema = z.object({
  status: z.enum(['open', 'in_progress', 'waiting_for_customer', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['technical', 'billing', 'general', 'feature_request', 'bug']).optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
