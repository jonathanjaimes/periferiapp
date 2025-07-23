import { useQuery } from '@tanstack/react-query';
import type { User } from '../../domain/models/User';

import { fetchUsersApi } from './usersApi';

export function useUsersQuery() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsersApi,
  });
}
