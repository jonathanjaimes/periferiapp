import { saveUser } from '../../data/storage';

export async function loginUser(username: string) {
  await saveUser(username);
  return username;
}
