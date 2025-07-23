import { useQuery } from '@tanstack/react-query';
import { User } from '../../domain/models/User';
import { userRepository } from '../repositories';

export function useUserDetailQuery(userId: number) {
  return useQuery<User | null, Error>({
    queryKey: ['userDetail', userId],
    queryFn: () => userRepository.getUserById(userId),
  });
}
