import bcrypt from 'bcryptjs';
import { UserRepository } from '@/server/repositories/UserRepository';
import { IUserDocument } from '@/server/models/User';

const userRepo = new UserRepository();

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<Omit<IUserDocument, 'password'>> {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error('Email already in use');
    const hashed = await bcrypt.hash(password, 12);
    const user = await userRepo.create({ name, email, password: hashed, role: 'user' });
    const userObj = user.toObject ? user.toObject() : { ...user };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...userWithoutPassword } = userObj as IUserDocument & { password: string };
    return userWithoutPassword as Omit<IUserDocument, 'password'>;
  }
}
