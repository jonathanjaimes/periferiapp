import { renderHook } from '@testing-library/react-native';
import * as authStore from '../../store/authStore';
import type { AuthState } from '../../store/authStore';
import { useLogin } from '../useLogin';

describe('useLogin', () => {
  const mockUser = 'Juan';
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation((selector: (state: AuthState) => unknown) =>
      selector({
        user: mockUser,
        loading: false,
        error: null,
        login: mockLogin,
        logout: mockLogout,
        loadUser: jest.fn(),
        setError: jest.fn(),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe retornar el usuario, loading y error del store', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe exponer las funciones login y logout', () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.login).toBe(mockLogin);
    expect(result.current.logout).toBe(mockLogout);
  });
});
