import { connectDB } from '@/lib/db';
import { User, IUserDocument } from '@/server/models/User';

type UserFilter = Record<string, unknown>;

export class UserRepository {
  async findById(id: string): Promise<IUserDocument | null> {
    await connectDB();
    return User.findById(id).lean() as Promise<IUserDocument | null>;
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    await connectDB();
    return User.findOne({ email: email.toLowerCase() }).lean() as Promise<IUserDocument | null>;
  }

  async findAll(filter: UserFilter = {}): Promise<IUserDocument[]> {
    await connectDB();
    return User.find(filter).select('-password').lean() as Promise<IUserDocument[]>;
  }

  async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
    await connectDB();
    const user = new User(data);
    return user.save() as Promise<IUserDocument>;
  }

  async update(id: string, data: Partial<IUserDocument>): Promise<IUserDocument | null> {
    await connectDB();
    return User.findByIdAndUpdate(id, data, { new: true })
      .select('-password')
      .lean() as Promise<IUserDocument | null>;
  }

  async findSupportAndAdmin(): Promise<IUserDocument[]> {
    await connectDB();
    return User.find({ role: { $in: ['support', 'admin'] } })
      .select('-password')
      .lean() as Promise<IUserDocument[]>;
  }
}
