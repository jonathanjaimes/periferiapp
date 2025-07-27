import { authRepository } from '../../data/repositories/authRepository';

export async function loginUser(username: string) {
  await authRepository.saveUser(username);
  return username;
}
