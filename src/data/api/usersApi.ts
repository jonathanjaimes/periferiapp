import { ApiUser } from './types';
import { USERS_API_URL } from './config';

export async function fetchUsersApi(): Promise<ApiUser[]> {
  const response = await fetch(USERS_API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }
  return response.json();
}

export async function fetchUserApi(id: number): Promise<ApiUser> {
  const response = await fetch(`${USERS_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('No se pudo cargar el usuario');
  }
  return response.json();
}
