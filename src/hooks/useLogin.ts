import { useAuthStore } from '../store/authStore';

export function useLogin() {
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
}
