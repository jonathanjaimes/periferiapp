import { useQuery } from '@tanstack/react-query';
import type { User } from '../../domain/models/User';
import { userRepository } from '../repositories';

export function useUsersQuery() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: userRepository.getUsers,
  });
}
