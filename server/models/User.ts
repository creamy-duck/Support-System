import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/types';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'support', 'admin'], default: 'user' },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
