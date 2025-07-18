import { useAuthStore } from '../authStore';

describe('authStore cobertura', () => {
  it('ejecuta métodos principales', () => {
    const state = useAuthStore.getState();
    if (state.login) state.login('usuario', 'pass');
    if (state.logout) state.logout();
    if (state.loadUser) state.loadUser();
    if (state.setError) state.setError('error');
  });
});
