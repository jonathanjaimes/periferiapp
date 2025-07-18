import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as useLoginModule from '../useLogin';
import { useLoginScreenLogic } from '../useLoginScreenLogic';

const mockDispatch = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: jest.fn(), // Mock vacío para evitar bucles
    useNavigation: () => ({ dispatch: mockDispatch }),
  };
});


import * as authStore from '../../store/authStore';
import type { AuthState } from '../../store/authStore';
import * as navigationModule from '@react-navigation/native';

const mockNavigate = jest.fn();

describe('useLoginScreenLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue(
      ({
        user: null,
        loading: false,
        error: null,
        login: jest.fn(),
        logout: jest.fn(),
      })
    );
    // No ejecutar el callback de useFocusEffect por defecto
    jest.spyOn(navigationModule, 'useFocusEffect').mockImplementation(jest.fn());
  });

  it('debe inicializar username y password vacíos', () => {
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({ login: jest.fn(), logout: jest.fn(), loading: false, error: null, user: null });
    const { result } = renderHook(() => useLoginScreenLogic());
    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
  });

  it('debe resetear username, password y error al enfocar la pantalla', () => {
    const setError = jest.fn();
    jest.spyOn(authStore, 'useAuthStore').mockImplementation((selector: (state: any) => any) => selector({ setError }));
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({ login: jest.fn(), logout: jest.fn(), loading: false, error: null, user: null });
    // Captura el callback y ejecútalo manualmente
    let callback: any;
    jest.spyOn(navigationModule, 'useFocusEffect').mockImplementation((cb: any) => { callback = cb; });
    renderHook(() => require('../useLoginScreenLogic').useLoginScreenLogic());
    callback(); // Ejecuta el efecto manualmente
    expect(setError).toHaveBeenCalledWith(null);
  });

  it('debe navegar a Feed si user está definido', () => {
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({ login: jest.fn(), logout: jest.fn(), loading: false, error: null, user: 'Juan' });
    renderHook(() => require('../useLoginScreenLogic').useLoginScreenLogic());
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('onSubmit debe limpiar error y llamar login', async () => {
    // Mockea useFocusEffect como función vacía SOLO en este test
    jest.spyOn(navigationModule, 'useFocusEffect').mockImplementation(jest.fn());
    const setError = jest.fn();
    jest.spyOn(authStore, 'useAuthStore').mockImplementation((selector: any) => selector({ setError }));
    const login = jest.fn();
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({ login, logout: jest.fn(), loading: false, error: null, user: null });
    const { result } = renderHook(() => require('../useLoginScreenLogic').useLoginScreenLogic());
    await act(async () => {
      result.current.setUsername('juan');
      result.current.setPassword('1234');
    });
    // Espera a que el hook re-renderice
    await waitFor(() => {
      expect(result.current.username).toBe('juan');
      expect(result.current.password).toBe('1234');
    });
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(setError).toHaveBeenCalledWith(null);
    expect(login).toHaveBeenCalledWith('juan', '1234');
  });
});
