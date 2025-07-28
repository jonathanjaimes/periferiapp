import { renderHook, act } from '@testing-library/react-native';
import { useLogin } from '../../src/hooks/useLogin';

// Mock del store de autenticación con variables mutables
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockUser = 'admin'; // Usuario es solo el username

// Variables mutables para el mock
let mockStoreState = {
  user: null as string | null,
  loading: false,
  error: null as string | null,
  login: mockLogin,
  logout: mockLogout,
};

jest.mock('../../src/store/authStore', () => ({
  useAuthStore: (selector: any) => {
    return selector(mockStoreState);
  },
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Restaurar estado por defecto
    mockStoreState = {
      user: null,
      loading: false,
      error: null,
      login: mockLogin,
      logout: mockLogout,
    };
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should call login function', async () => {
    const { result } = renderHook(() => useLogin());
    const credentials = { username: 'admin', password: '1234' };

    await act(async () => {
      await result.current.login(credentials.username, credentials.password);
    });

    expect(mockLogin).toHaveBeenCalledWith(
      credentials.username,
      credentials.password,
    );
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('should call logout function', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should return all store properties', () => {
    const { result } = renderHook(() => useLogin());

    // Verificar que todas las propiedades del store están disponibles
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });

  it('should handle different store states', () => {
    // Cambiar el estado del mock directamente
    mockStoreState.user = mockUser;
    mockStoreState.loading = true;
    mockStoreState.error = 'Login failed';

    const { result } = renderHook(() => useLogin());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe('Login failed');
  });

  it('should maintain function references', () => {
    const { result, rerender } = renderHook(() => useLogin());

    const initialLogin = result.current.login;
    const initialLogout = result.current.logout;

    rerender({});

    expect(result.current.login).toBe(initialLogin);
    expect(result.current.logout).toBe(initialLogout);
  });
});
