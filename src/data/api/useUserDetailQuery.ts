import { useQuery } from '@tanstack/react-query';
import { User } from '../../domain/models/User';

import { fetchUserApi } from './usersApi';

export function useUserDetailQuery(userId: number) {
  return useQuery<User, Error>({
    queryKey: ['userDetail', userId],
    queryFn: () => fetchUserApi(userId),
  });
}
