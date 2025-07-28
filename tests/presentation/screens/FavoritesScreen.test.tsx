import React from 'react';
import { render } from '@testing-library/react-native';
import FavoritesScreen from '../../../src/presentation/screens/FavoritesScreen';

// Mock del hook useFavorites
const mockUseFavorites = {
  user: null as any,
  favorites: [] as any[],
  loading: false,
};

jest.mock('../../../src/hooks/useFavorites', () => ({
  useFavorites: () => mockUseFavorites,
}));

// Mock de navegación
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock de Geofence data
const mockFavorites = [
  {
    id: '1',
    name: 'Casa',
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 100,
  },
  {
    id: '2',
    name: 'Trabajo',
    latitude: 40.7589,
    longitude: -73.9851,
    radius: 200,
  },
];

describe('FavoritesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFavorites.user = null;
    mockUseFavorites.favorites = [];
    mockUseFavorites.loading = false;
  });

  it('should render login message when user is not authenticated', () => {
    mockUseFavorites.user = null;
    
    const { getByText } = render(<FavoritesScreen />);
    
    expect(getByText('Debes iniciar sesión para administrar tus favoritos.')).toBeTruthy();
  });

  it('should render loading state when loading is true', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.loading = true;
    
    const { getByText, UNSAFE_getByType } = render(<FavoritesScreen />);
    
    expect(getByText('Cargando favoritos...')).toBeTruthy();
    
    const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(activityIndicator.props.size).toBe('large');
    expect(activityIndicator.props.color).toBe('#cd3422');
  });

  it('should render empty state when user has no favorites', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.favorites = [];
    mockUseFavorites.loading = false;
    
    const { getByText } = render(<FavoritesScreen />);
    
    expect(getByText('No tienes usuarios favoritos aún.')).toBeTruthy();
  });

  it('should render favorites list when user has favorites', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.favorites = mockFavorites;
    mockUseFavorites.loading = false;
    
    const { getByText, UNSAFE_getByType } = render(<FavoritesScreen />);
    
    // Verificar que se renderiza el FlatList
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    expect(flatList.props.data).toEqual(mockFavorites);
    
    // Verificar que se muestran los datos del primer favorito
    expect(getByText('Nombre: Casa')).toBeTruthy();
    expect(getByText('Latitud: 40.7128')).toBeTruthy();
    expect(getByText('Longitud: -74.006')).toBeTruthy();
  });

  it('should have correct keyExtractor for FlatList', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.favorites = mockFavorites;
    
    const { UNSAFE_getByType } = render(<FavoritesScreen />);
    
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    const keyExtractor = flatList.props.keyExtractor;
    
    expect(keyExtractor(mockFavorites[0])).toBe('1');
    expect(keyExtractor(mockFavorites[1])).toBe('2');
  });

  it('should navigate to GeofenceDetail when favorite item is pressed', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.favorites = mockFavorites;
    
    const { UNSAFE_getAllByType } = render(<FavoritesScreen />);
    
    // Obtener todos los TouchableOpacity (items de favoritos)
    const touchableOpacities = UNSAFE_getAllByType(require('react-native').TouchableOpacity as any);
    
    // Presionar el primer item
    const firstItem = touchableOpacities[0];
    firstItem.props.onPress();
    
    expect(mockNavigate).toHaveBeenCalledWith('GeofenceDetail', { geofenceId: '1' });
  });

  it('should render multiple favorites correctly', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.favorites = mockFavorites;
    
    const { getByText } = render(<FavoritesScreen />);
    
    // Verificar que se muestran ambos favoritos
    expect(getByText('Nombre: Casa')).toBeTruthy();
    expect(getByText('Nombre: Trabajo')).toBeTruthy();
    expect(getByText('Latitud: 40.7128')).toBeTruthy();
    expect(getByText('Latitud: 40.7589')).toBeTruthy();
  });

  it('should have correct FlatList configuration', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.favorites = mockFavorites;
    
    const { UNSAFE_getByType } = render(<FavoritesScreen />);
    
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    
    expect(flatList.props.data).toEqual(mockFavorites);
    expect(flatList.props.keyExtractor).toBeDefined();
    expect(flatList.props.renderItem).toBeDefined();
    expect(flatList.props.contentContainerStyle).toBeDefined();
  });

  it('should handle different user states', () => {
    // Test con usuario autenticado
    mockUseFavorites.user = { id: '2', email: 'user@example.com' };
    mockUseFavorites.favorites = [];
    
    const { getByText, rerender } = render(<FavoritesScreen />);
    
    expect(getByText('No tienes usuarios favoritos aún.')).toBeTruthy();
    
    // Test sin usuario
    mockUseFavorites.user = null;
    rerender(<FavoritesScreen />);
    
    expect(getByText('Debes iniciar sesión para administrar tus favoritos.')).toBeTruthy();
  });

  it('should handle loading state transitions', () => {
    mockUseFavorites.user = { id: '1', email: 'test@test.com' };
    mockUseFavorites.loading = true;
    mockUseFavorites.favorites = [];
    
    const { getByText, rerender } = render(<FavoritesScreen />);
    
    // Estado de loading
    expect(getByText('Cargando favoritos...')).toBeTruthy();
    
    // Cambiar a estado cargado sin favoritos
    mockUseFavorites.loading = false;
    rerender(<FavoritesScreen />);
    
    expect(getByText('No tienes usuarios favoritos aún.')).toBeTruthy();
  });
});
