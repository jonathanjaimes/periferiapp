import { useQuery } from '@tanstack/react-query';
import type { User } from '../../domain/models/User';

const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users';

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(USERS_ENDPOINT);
  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }
  return response.json();
};

export function useUsersQuery() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
