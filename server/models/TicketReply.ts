import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITicketReplyDocument extends Document {
  ticket: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  isInternal: boolean;
  createdAt: Date;
}

const TicketReplySchema = new Schema<ITicketReplyDocument>(
  {
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 10000 },
    isInternal: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TicketReplySchema.index({ ticket: 1 });
TicketReplySchema.index({ author: 1 });
TicketReplySchema.index({ createdAt: 1 });

export const TicketReply =
  mongoose.models.TicketReply ||
  mongoose.model<ITicketReplyDocument>('TicketReply', TicketReplySchema);
