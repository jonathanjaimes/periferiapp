import { saveUserApi, getUserApi, removeUserApi } from '../api/authApi';
import { IAuthRepository } from '../../domain/repositories';

export const authRepository: IAuthRepository = {
  async saveUser(username: string): Promise<void> {
    return await saveUserApi(username);
  },
  async getUser(): Promise<string | null> {
    return await getUserApi();
  },
  async removeUser(): Promise<void> {
    return await removeUserApi();
  },
};
