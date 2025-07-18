import { useQuery } from '@tanstack/react-query';
import { User } from '../../domain/models/User';

const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

const fetchUserDetail = async (userId: number): Promise<User> => {
  const res = await fetch(`${USERS_API_URL}/${userId}`);
  if (!res.ok) throw new Error('No se pudo cargar el usuario');
  return res.json();
};

export function useUserDetailQuery(userId: number) {
  return useQuery<User, Error>({
    queryKey: ['userDetail', userId],
    queryFn: () => fetchUserDetail(userId),
  });
}
