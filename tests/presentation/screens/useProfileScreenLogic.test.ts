import { renderHook } from '@testing-library/react-native';

// Mock del hook useLogin
const mockUseLogin = {
  user: null as string | null,
  loading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
};

jest.mock('../../../src/hooks/useLogin', () => ({
  useLogin: () => mockUseLogin,
}));

// Mock simplificado de navegación que evita el problema de CommonActions
const mockDispatch = jest.fn();
const mockNavigation = {
  dispatch: mockDispatch,
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  CommonActions: {
    navigate: jest.fn(() => ({ type: 'NAVIGATE', payload: {} })),
  },
}));

import { useProfileScreenLogic } from '../../../src/presentation/screens/useProfileScreenLogic';
import { CommonActions } from '@react-navigation/native';

// Spy en CommonActions.navigate después de la importación
const mockNavigate = jest.spyOn(CommonActions, 'navigate');

describe('useProfileScreenLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.user = null;
  });

  it('should not navigate when user is initially null', () => {
    mockUseLogin.user = null;
    
    renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should not navigate when user is initially authenticated', () => {
    mockUseLogin.user = 'admin';
    
    renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should navigate when user changes from null to authenticated', () => {
    mockUseLogin.user = null;
    
    const { rerender } = renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    // Cambiar a usuario autenticado
    mockUseLogin.user = 'admin';
    rerender({ tabName: 'Feed' });
    
    expect(mockNavigate).toHaveBeenCalledWith({ name: 'Feed' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should navigate to different tab names', () => {
    mockUseLogin.user = null;
    
    const { rerender } = renderHook(() => useProfileScreenLogic({ tabName: 'Profile' }));
    
    // Cambiar a usuario autenticado
    mockUseLogin.user = 'testuser';
    rerender({ tabName: 'Profile' });
    
    expect(mockNavigate).toHaveBeenCalledWith({ name: 'Profile' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should not navigate when user changes from authenticated to null', () => {
    mockUseLogin.user = 'admin';
    
    const { rerender } = renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    // Cambiar a usuario no autenticado
    mockUseLogin.user = null;
    rerender({ tabName: 'Feed' });
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should not navigate when user changes from one authenticated user to another', () => {
    mockUseLogin.user = 'user1';
    
    const { rerender } = renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    // Cambiar a otro usuario autenticado
    mockUseLogin.user = 'user2';
    rerender({ tabName: 'Feed' });
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should handle multiple authentication cycles', () => {
    mockUseLogin.user = null;
    
    const { rerender } = renderHook(() => useProfileScreenLogic({ tabName: 'Home' }));
    
    // Primera autenticación
    mockUseLogin.user = 'admin';
    rerender({ tabName: 'Home' });
    
    expect(mockNavigate).toHaveBeenCalledWith({ name: 'Home' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    
    jest.clearAllMocks();
    
    // Logout
    mockUseLogin.user = null;
    rerender({ tabName: 'Home' });
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    
    // Segunda autenticación
    mockUseLogin.user = 'newuser';
    rerender({ tabName: 'Home' });
    
    expect(mockNavigate).toHaveBeenCalledWith({ name: 'Home' });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should return empty object', () => {
    mockUseLogin.user = 'admin';
    
    const { result } = renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    expect(result.current).toEqual({});
  });

  it('should handle different tab names correctly', () => {
    const tabNames = ['Feed', 'Profile', 'Settings', 'Home'];
    
    tabNames.forEach((tabName) => {
      jest.clearAllMocks();
      mockUseLogin.user = null;
      
      const { rerender } = renderHook(() => useProfileScreenLogic({ tabName }));
      
      // Autenticar usuario
      mockUseLogin.user = 'testuser';
      rerender({ tabName });
      
      expect(mockNavigate).toHaveBeenCalledWith({ name: tabName });
      expect(mockDispatch).toHaveBeenCalledWith(expect.anything());
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  it('should maintain ref consistency across renders', () => {
    mockUseLogin.user = 'admin';
    
    const { rerender } = renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    // Múltiples rerenders sin cambio de usuario
    rerender({ tabName: 'Feed' });
    rerender({ tabName: 'Feed' });
    rerender({ tabName: 'Feed' });
    
    // No debería navegar porque el usuario no cambió
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should handle rapid user changes correctly', () => {
    mockUseLogin.user = null;
    
    const { rerender } = renderHook(() => useProfileScreenLogic({ tabName: 'Feed' }));
    
    // Cambios rápidos
    mockUseLogin.user = 'user1';
    rerender({ tabName: 'Feed' });
    
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ name: 'Feed' });
    
    jest.clearAllMocks();
    
    // Cambio a otro usuario (no debería navegar)
    mockUseLogin.user = 'user2';
    rerender({ tabName: 'Feed' });
    
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Logout y nueva autenticación
    mockUseLogin.user = null;
    rerender({ tabName: 'Feed' });
    
    mockUseLogin.user = 'user3';
    rerender({ tabName: 'Feed' });
    
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({ name: 'Feed' });
  });
});
