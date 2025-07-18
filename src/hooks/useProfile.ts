import { useAuthStore } from '../store/authStore';

export function useProfile() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return {
    user,
    logout,
  };
}
