import mongoose, { Schema, Document, Types } from 'mongoose';
import { AuditAction } from '@/types';

export interface IAuditLogDocument extends Document {
  ticket: Types.ObjectId;
  performedBy: Types.ObjectId;
  action: AuditAction;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['status_changed', 'assigned', 'unassigned', 'closed', 'created', 'reply_added'],
      required: true,
    },
    oldValue: { type: String },
    newValue: { type: String },
  },
  { timestamps: true },
);

AuditLogSchema.index({ ticket: 1 });
AuditLogSchema.index({ performedBy: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
