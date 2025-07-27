import { saveUser, getUser, removeUser } from '../storage/auth';

export async function saveUserApi(username: string): Promise<void> {
  return await saveUser(username);
}

export async function getUserApi(): Promise<string | null> {
  return await getUser();
}

export async function removeUserApi(): Promise<void> {
  return await removeUser();
}
