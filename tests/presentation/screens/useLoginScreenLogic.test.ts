import { renderHook, act } from '@testing-library/react-native';

// Mock de useFocusEffect - debe estar antes del import del hook
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => {
    // No ejecutar el callback automáticamente para evitar loops infinitos
    // El callback se puede ejecutar manualmente en los tests si es necesario
  }),
}));

// Mock de useLogin
const mockUseLogin = {
  login: jest.fn(),
  loading: false,
  error: null as string | null,
};

jest.mock('../../../src/hooks/useLogin', () => ({
  useLogin: () => mockUseLogin,
}));

// Mock de useAuthStore
const mockSetError = jest.fn();
jest.mock('../../../src/store/authStore', () => ({
  useAuthStore: (selector: any) => {
    if (selector.toString().includes('setError')) {
      return mockSetError;
    }
    return null;
  },
}));

import { useLoginScreenLogic } from '../../../src/presentation/screens/useLoginScreenLogic';
import { useFocusEffect } from '@react-navigation/native';

// Obtener referencia al mock
const mockUseFocusEffect = jest.mocked(useFocusEffect);

describe('useLoginScreenLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.login.mockReset();
    mockUseLogin.loading = false;
    mockUseLogin.error = null;
  });

  it('should initialize with empty username and password', () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
  });

  it('should return loading and error from useLogin', () => {
    mockUseLogin.loading = true;
    mockUseLogin.error = 'Test error';
    
    const { result } = renderHook(() => useLoginScreenLogic());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe('Test error');
  });

  it('should update username when setUsername is called', () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    act(() => {
      result.current.setUsername('admin');
    });
    
    expect(result.current.username).toBe('admin');
  });

  it('should update password when setPassword is called', () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    act(() => {
      result.current.setPassword('1234');
    });
    
    expect(result.current.password).toBe('1234');
  });

  it('should call login with correct credentials on submit', async () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('1234');
    });
    
    await act(async () => {
      await result.current.onSubmit();
    });
    
    expect(mockUseLogin.login).toHaveBeenCalledWith('admin', '1234');
  });

  it('should clear error before submitting', async () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    await act(async () => {
      await result.current.onSubmit();
    });
    
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('should setup useFocusEffect callback', () => {
    renderHook(() => useLoginScreenLogic());
    
    expect(mockUseFocusEffect).toHaveBeenCalled();
    
    // Verificar que se pasó un callback
    const callback = mockUseFocusEffect.mock.calls[0][0];
    expect(typeof callback).toBe('function');
  });

  it('should reset form when focus effect is triggered', () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    // Establecer algunos valores
    act(() => {
      result.current.setUsername('test');
      result.current.setPassword('test');
    });
    
    expect(result.current.username).toBe('test');
    expect(result.current.password).toBe('test');
    
    // Simular el callback de useFocusEffect
    const focusCallback = mockUseFocusEffect.mock.calls[0][0];
    
    act(() => {
      focusCallback();
    });
    
    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('should handle submit with empty credentials', async () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    await act(async () => {
      await result.current.onSubmit();
    });
    
    expect(mockUseLogin.login).toHaveBeenCalledWith('', '');
  });

  it('should handle submit when login throws error', async () => {
    mockUseLogin.login.mockRejectedValue(new Error('Login failed'));
    
    const { result } = renderHook(() => useLoginScreenLogic());
    
    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('wrong');
    });
    
    // El onSubmit puede lanzar error, pero lo manejamos
    await act(async () => {
      try {
        await result.current.onSubmit();
      } catch (error) {
        // Error esperado del mock
      }
    });
    
    expect(mockUseLogin.login).toHaveBeenCalledWith('admin', 'wrong');
    // El error debería ser manejado por useLogin
  });

  it('should maintain stable references for setters', () => {
    const { result, rerender } = renderHook(() => useLoginScreenLogic());
    
    const initialSetUsername = result.current.setUsername;
    const initialSetPassword = result.current.setPassword;
    
    rerender({});
    
    expect(result.current.setUsername).toBe(initialSetUsername);
    expect(result.current.setPassword).toBe(initialSetPassword);
  });

  it('should create new onSubmit function on each render', () => {
    const { result, rerender } = renderHook(() => useLoginScreenLogic());
    
    const initialOnSubmit = result.current.onSubmit;
    
    rerender({});
    
    // onSubmit se recrea en cada render porque es una función async inline
    expect(result.current.onSubmit).not.toBe(initialOnSubmit);
  });

  it('should handle multiple rapid submissions', async () => {
    const { result } = renderHook(() => useLoginScreenLogic());
    
    act(() => {
      result.current.setUsername('admin');
      result.current.setPassword('1234');
    });
    
    // Simular múltiples submissions rápidas
    await act(async () => {
      const promises = [
        result.current.onSubmit(),
        result.current.onSubmit(),
        result.current.onSubmit(),
      ];
      await Promise.all(promises);
    });
    
    // Debería llamar a login múltiples veces
    expect(mockUseLogin.login).toHaveBeenCalledTimes(3);
    expect(mockSetError).toHaveBeenCalledTimes(3);
  });

  it('should handle different loading states', () => {
    // Inicialmente no loading
    const { result, rerender } = renderHook(() => useLoginScreenLogic());
    expect(result.current.loading).toBe(false);
    
    // Cambiar a loading
    mockUseLogin.loading = true;
    rerender({});
    expect(result.current.loading).toBe(true);
    
    // Volver a no loading
    mockUseLogin.loading = false;
    rerender({});
    expect(result.current.loading).toBe(false);
  });

  it('should handle different error states', () => {
    // Inicialmente sin error
    const { result, rerender } = renderHook(() => useLoginScreenLogic());
    expect(result.current.error).toBeNull();
    
    // Con error
    mockUseLogin.error = 'Credenciales inválidas';
    rerender({});
    expect(result.current.error).toBe('Credenciales inválidas');
    
    // Sin error nuevamente
    mockUseLogin.error = null;
    rerender({});
    expect(result.current.error).toBeNull();
  });
});
