import { saveUser } from '../../data/storage/auth';

export async function loginUser(username: string) {
  // Aquí podrías agregar validaciones o lógica adicional
  await saveUser(username);
  return username;
}
