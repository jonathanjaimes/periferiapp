import React from 'react';
import { render } from '@testing-library/react-native';

// Mock del hook useProfileScreenLogic - debe estar antes del import del componente
jest.mock('../../../src/presentation/screens/useProfileScreenLogic', () => ({
  useProfileScreenLogic: jest.fn(() => {
    // Hook que no retorna nada, solo se ejecuta
  }),
}));

// Mock del hook useProfile
const mockUseProfile = {
  user: null as string | null,
  logout: jest.fn(),
};

jest.mock('../../../src/hooks/useProfile', () => ({
  useProfile: () => mockUseProfile,
}));

// Mock de CustomButton
jest.mock('../../../src/presentation/components/CustomButton', () => 'CustomButton');

// Mock de react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock de LoginScreen
jest.mock('../../../src/presentation/screens/LoginScreen', () => ({
  default: 'LoginScreen',
}));

import ProfileScreen from '../../../src/presentation/screens/ProfileScreen';
import { useProfileScreenLogic } from '../../../src/presentation/screens/useProfileScreenLogic';

// Obtener referencia al mock
const mockUseProfileScreenLogic = jest.mocked(useProfileScreenLogic);

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfile.user = null;
  });

  it('should render LoginScreen when user is not authenticated', () => {
    mockUseProfile.user = null;
    
    const { UNSAFE_getByType } = render(<ProfileScreen />);
    
    const loginScreen = UNSAFE_getByType('LoginScreen' as any);
    expect(loginScreen).toBeTruthy();
  });

  it('should render profile content when user is authenticated', () => {
    mockUseProfile.user = 'admin';
    
    const { getByText, UNSAFE_getByType } = render(<ProfileScreen />);
    
    // Verificar que se muestra el nombre del usuario
    expect(getByText('admin')).toBeTruthy();
    
    // Verificar que se muestra el icono
    const icon = UNSAFE_getByType('Icon' as any);
    expect(icon.props.name).toBe('person-circle');
    expect(icon.props.size).toBe(96);
    expect(icon.props.color).toBe('#cd3422');
    
    // Verificar que se muestra el botón de logout
    const button = UNSAFE_getByType('CustomButton' as any);
    expect(button.props.title).toBe('Cerrar sesión');
    expect(button.props.onPress).toBe(mockUseProfile.logout);
  });

  it('should call logout when logout button is pressed', () => {
    mockUseProfile.user = 'testuser';
    
    const { UNSAFE_getByType } = render(<ProfileScreen />);
    
    const button = UNSAFE_getByType('CustomButton' as any);
    button.props.onPress();
    
    expect(mockUseProfile.logout).toHaveBeenCalled();
  });

  it('should call useProfileScreenLogic with correct parameters', () => {
    mockUseProfile.user = 'admin';
    
    render(<ProfileScreen />);
    
    expect(mockUseProfileScreenLogic).toHaveBeenCalledWith({ tabName: 'Feed' });
  });

  it('should have correct button styling props', () => {
    mockUseProfile.user = 'admin';
    
    const { UNSAFE_getByType } = render(<ProfileScreen />);
    
    const button = UNSAFE_getByType('CustomButton' as any);
    
    expect(button.props.style).toBeDefined();
    expect(button.props.textStyle).toBeDefined();
  });

  it('should render different usernames correctly', () => {
    // Test con un username
    mockUseProfile.user = 'user123';
    
    const { getByText, rerender } = render(<ProfileScreen />);
    expect(getByText('user123')).toBeTruthy();
    
    // Test con otro username
    mockUseProfile.user = 'admin@example.com';
    rerender(<ProfileScreen />);
    expect(getByText('admin@example.com')).toBeTruthy();
  });

  it('should handle transition from authenticated to unauthenticated', () => {
    // Inicialmente autenticado
    mockUseProfile.user = 'admin';
    
    const { getByText, UNSAFE_getByType, rerender } = render(<ProfileScreen />);
    expect(getByText('admin')).toBeTruthy();
    
    // Cambiar a no autenticado
    mockUseProfile.user = null;
    rerender(<ProfileScreen />);
    
    const loginScreen = UNSAFE_getByType('LoginScreen' as any);
    expect(loginScreen).toBeTruthy();
  });

  it('should have correct icon configuration', () => {
    mockUseProfile.user = 'admin';
    
    const { UNSAFE_getByType } = render(<ProfileScreen />);
    
    const icon = UNSAFE_getByType('Icon' as any);
    
    expect(icon.props.name).toBe('person-circle');
    expect(icon.props.size).toBe(96);
    expect(icon.props.color).toBe('#cd3422');
    expect(icon.props.style).toBeDefined();
  });

  it('should call useProfileScreenLogic even when user is null', () => {
    mockUseProfile.user = null;
    
    render(<ProfileScreen />);
    
    expect(mockUseProfileScreenLogic).toHaveBeenCalledWith({ tabName: 'Feed' });
  });

  it('should render CustomButton with correct props', () => {
    mockUseProfile.user = 'testuser';
    
    const { UNSAFE_getByType } = render(<ProfileScreen />);
    
    const button = UNSAFE_getByType('CustomButton' as any);
    
    expect(button.props.title).toBe('Cerrar sesión');
    expect(button.props.onPress).toBe(mockUseProfile.logout);
    expect(button.props.style).toBeDefined();
    expect(button.props.textStyle).toBeDefined();
  });
});
