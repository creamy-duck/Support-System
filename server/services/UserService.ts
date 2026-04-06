import { UserRepository } from '@/server/repositories/UserRepository';
import { IUserDocument } from '@/server/models/User';
import { UserRole } from '@/types';

const userRepo = new UserRepository();

export class UserService {
  async getUsers(requesterRole: string): Promise<IUserDocument[]> {
    if (requesterRole !== 'admin') throw new Error('Forbidden');
    return userRepo.findAll();
  }

  async getSupportUsers(): Promise<IUserDocument[]> {
    return userRepo.findSupportAndAdmin();
  }

  async updateRole(
    userId: string,
    role: UserRole,
    requesterRole: string,
  ): Promise<IUserDocument | null> {
    if (requesterRole !== 'admin') throw new Error('Forbidden');
    return userRepo.update(userId, { role });
  }
}
