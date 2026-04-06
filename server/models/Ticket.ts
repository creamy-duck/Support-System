import mongoose, { Schema, Document, Types } from 'mongoose';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types';

export interface ITicketDocument extends Document {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId | null;
  attachments: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicketDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_for_customer', 'closed'],
      default: 'open',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    category: {
      type: String,
      enum: ['technical', 'billing', 'general', 'feature_request', 'bug'],
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    attachments: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true },
);

TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ category: 1 });
TicketSchema.index({ assignedTo: 1 });
TicketSchema.index({ createdBy: 1 });
TicketSchema.index({ createdAt: -1 });
TicketSchema.index({ title: 'text', description: 'text' });

export const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicketDocument>('Ticket', TicketSchema);
