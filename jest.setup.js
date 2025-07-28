// Mocks para módulos nativos de React Navigation y React Native
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: (props) => props.children,
  NativeScreen: (props) => props.children,
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock global de console.error para tests más limpios
// Mantiene el logging en producción pero silencia en tests
global.console = {
  ...console,
  error: jest.fn(), // Mock silencioso de console.error
};

// Configuración global para tests de React Query v5+
import { QueryClient } from '@tanstack/react-query';

// Fuerza el flag experimental globalmente para todos los QueryClient
QueryClient.prototype.experimental = { prefetchInRender: true };
