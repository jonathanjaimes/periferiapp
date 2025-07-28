import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../../../src/presentation/screens/LoginScreen';

// Mock del hook useLoginScreenLogic
const mockUseLoginScreenLogic = {
  username: '',
  setUsername: jest.fn(),
  password: '',
  setPassword: jest.fn(),
  loading: false,
  error: null as string | null,
  onSubmit: jest.fn(),
};

jest.mock('../../../src/hooks/useLoginScreenLogic', () => ({
  useLoginScreenLogic: () => mockUseLoginScreenLogic,
}));

// Mock del CustomButton
jest.mock('../../../src/presentation/components/CustomButton', () => 'CustomButton');

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock values
    mockUseLoginScreenLogic.username = '';
    mockUseLoginScreenLogic.password = '';
    mockUseLoginScreenLogic.loading = false;
    mockUseLoginScreenLogic.error = null;
  });

  it('should render login title', () => {
    const { getByText } = render(<LoginScreen />);
    
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });

  it('should render username and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Nombre de usuario (ej: admin)')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña (ej: 1234)')).toBeTruthy();
  });

  it('should render login button with correct title', () => {
    const { UNSAFE_getByType } = render(<LoginScreen />);
    
    const button = UNSAFE_getByType('CustomButton' as any);
    
    expect(button.props.title).toBe('Iniciar sesión');
    expect(button.props.disabled).toBe(false);
  });

  it('should call setUsername when username input changes', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    const usernameInput = getByPlaceholderText('Nombre de usuario (ej: admin)');
    usernameInput.props.onChangeText('admin');
    
    expect(mockUseLoginScreenLogic.setUsername).toHaveBeenCalledWith('admin');
  });

  it('should call setPassword when password input changes', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    const passwordInput = getByPlaceholderText('Contraseña (ej: 1234)');
    passwordInput.props.onChangeText('1234');
    
    expect(mockUseLoginScreenLogic.setPassword).toHaveBeenCalledWith('1234');
  });

  it('should call onSubmit when login button is pressed', () => {
    const { UNSAFE_getByType } = render(<LoginScreen />);
    
    const button = UNSAFE_getByType('CustomButton' as any);
    button.props.onPress();
    
    expect(mockUseLoginScreenLogic.onSubmit).toHaveBeenCalled();
  });

  it('should display loading state correctly', () => {
    mockUseLoginScreenLogic.loading = true;
    
    const { UNSAFE_getByType, getByText } = render(<LoginScreen />);
    
    const button = UNSAFE_getByType('CustomButton' as any);
    expect(button.props.title).toBe('Cargando...');
    expect(button.props.disabled).toBe(true);
    
    // Verificar ActivityIndicator
    const activityIndicator = UNSAFE_getByType('ActivityIndicator' as any);
    expect(activityIndicator.props.size).toBe('large');
    expect(activityIndicator.props.color).toBe('#cd3422');
  });

  it('should display error message when error exists', () => {
    mockUseLoginScreenLogic.error = 'Credenciales inválidas';
    
    const { getByText } = render(<LoginScreen />);
    
    expect(getByText('Credenciales inválidas')).toBeTruthy();
  });

  it('should not display error message when error is null', () => {
    mockUseLoginScreenLogic.error = null;
    
    const { queryByText } = render(<LoginScreen />);
    
    expect(queryByText('Credenciales inválidas')).toBeNull();
  });

  it('should not display loading overlay when not loading', () => {
    mockUseLoginScreenLogic.loading = false;
    
    const { queryByTestId } = render(<LoginScreen />);
    
    // ActivityIndicator no debería estar presente cuando no está cargando
    expect(queryByTestId('loading-indicator')).toBeNull();
  });

  it('should have correct input properties', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    const usernameInput = getByPlaceholderText('Nombre de usuario (ej: admin)');
    const passwordInput = getByPlaceholderText('Contraseña (ej: 1234)');
    
    expect(usernameInput.props.autoCapitalize).toBe('none');
    expect(usernameInput.props.placeholderTextColor).toBe('#888');
    
    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(passwordInput.props.placeholderTextColor).toBe('#888');
  });

  it('should display input values from hook', () => {
    mockUseLoginScreenLogic.username = 'admin';
    mockUseLoginScreenLogic.password = '1234';
    
    const { getByDisplayValue } = render(<LoginScreen />);
    
    expect(getByDisplayValue('admin')).toBeTruthy();
    expect(getByDisplayValue('1234')).toBeTruthy();
  });

  it('should have correct button styling props', () => {
    const { UNSAFE_getByType } = render(<LoginScreen />);
    
    const button = UNSAFE_getByType('CustomButton' as any);
    
    expect(button.props.style).toBeDefined();
    expect(button.props.textStyle).toBeDefined();
  });

  it('should handle empty username and password', () => {
    mockUseLoginScreenLogic.username = '';
    mockUseLoginScreenLogic.password = '';
    
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    const usernameInput = getByPlaceholderText('Nombre de usuario (ej: admin)');
    const passwordInput = getByPlaceholderText('Contraseña (ej: 1234)');
    
    expect(usernameInput.props.value).toBe('');
    expect(passwordInput.props.value).toBe('');
  });

  it('should handle different error messages', () => {
    mockUseLoginScreenLogic.error = 'Error de conexión';
    
    const { getByText } = render(<LoginScreen />);
    
    expect(getByText('Error de conexión')).toBeTruthy();
  });

  it('should handle loading and error states simultaneously', () => {
    mockUseLoginScreenLogic.loading = true;
    mockUseLoginScreenLogic.error = 'Error anterior';
    
    const { getByText, UNSAFE_getByType } = render(<LoginScreen />);
    
    // Debería mostrar tanto loading como error
    const button = UNSAFE_getByType('CustomButton' as any);
    expect(button.props.title).toBe('Cargando...');
    expect(button.props.disabled).toBe(true);
    expect(getByText('Error anterior')).toBeTruthy();
  });
});
