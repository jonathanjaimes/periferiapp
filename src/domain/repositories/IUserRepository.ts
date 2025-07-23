import { User } from '../models/User';

export interface IUserRepository {
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
}
