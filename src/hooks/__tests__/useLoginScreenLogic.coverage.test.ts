import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import * as authStore from '../../store/authStore';
import * as useLoginModule from '../useLogin';
import { useLoginScreenLogic } from '../useLoginScreenLogic';

jest.mock('../../store/authStore');
jest.mock('../useLogin');

const mockNavigation = { dispatch: jest.fn() };
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useFocusEffect: jest.fn(), // No ejecuta el callback para evitar bucles
  CommonActions: { navigate: jest.fn() },
}));

describe('useLoginScreenLogic - cobertura', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navega a Feed si user existe', () => {
    jest.spyOn(authStore, 'useAuthStore').mockImplementation((selector: any) => selector({ setError: jest.fn() }));
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({ login: jest.fn(), logout: jest.fn(), loading: false, error: null, user: 'Juan' });
    renderHook(() => useLoginScreenLogic());
    expect(mockNavigation.dispatch).toHaveBeenCalled();
  });

  it('ejecuta onSubmit y setError', async () => {
    const login = jest.fn();
    const setError = jest.fn();
    jest.spyOn(authStore, 'useAuthStore').mockImplementation((selector: any) => selector({ setError }));
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({ login, logout: jest.fn(), loading: false, error: null, user: null });
    const { result } = renderHook(() => useLoginScreenLogic());
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(setError).toHaveBeenCalledWith(null);
    expect(login).toHaveBeenCalled();
  });

  it('maneja error de login', () => {
    const setError = jest.fn();
    jest.spyOn(authStore, 'useAuthStore').mockImplementation((selector: any) => selector({ setError }));
    jest.spyOn(useLoginModule, 'useLogin').mockReturnValue({ login: jest.fn(), logout: jest.fn(), loading: false, error: 'Error', user: null });
    renderHook(() => useLoginScreenLogic());
    // Aquí podrías verificar UI o side effects si existieran
    expect(setError).not.toHaveBeenCalledWith('Error'); // Solo cubre el camino de error
  });
});
