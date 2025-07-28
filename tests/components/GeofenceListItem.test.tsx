import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GeofenceListItem } from '../../src/components/GeofenceListItem';

// Mock de react-native-push-notification
jest.mock('react-native-push-notification', () => ({
  localNotification: jest.fn(),
  configure: jest.fn(),
  requestPermissions: jest.fn(),
}));

// Mock del hook useFavoriteActions (necesario para FavoriteButton)
const mockHandleFavorite = jest.fn();
const mockIsFavorite = jest.fn();
const mockUseFavoriteActions = {
  isFavorite: mockIsFavorite,
  handleFavorite: mockHandleFavorite,
  authUser: 'admin', // Usuario es solo el username
};

jest.mock('../../src/hooks/useFavoriteActions', () => ({
  useFavoriteActions: () => mockUseFavoriteActions,
}));

// Mock de react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock de navegación
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('GeofenceListItem', () => {
  const mockGeofence = {
    id: '1',
    name: 'Test Geofence',
    latitude: 40.7128,
    longitude: -74.006,
    radius: 100,
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsFavorite.mockReturnValue(false);
    // Restaurar usuario autenticado por defecto
    mockUseFavoriteActions.authUser = 'admin';
  });

  it('should render geofence information correctly', () => {
    const { getByText } = render(
      <GeofenceListItem geofence={mockGeofence} onPress={mockOnPress} />,
    );
    
    expect(getByText('Test Geofence')).toBeTruthy();
    expect(getByText('Latitud: 40.7128')).toBeTruthy();
    expect(getByText('Longitud: -74.006')).toBeTruthy();
  });

  it('should call onPress when touched', () => {
    const { UNSAFE_getByType } = render(
      <GeofenceListItem geofence={mockGeofence} onPress={mockOnPress} />,
    );
    
    const touchable = UNSAFE_getByType(require('react-native').TouchableOpacity);
    fireEvent.press(touchable);
    
    expect(mockOnPress).toHaveBeenCalledWith(mockGeofence);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should display latitude and longitude with correct format', () => {
    const customGeofence = {
      id: '2',
      name: 'Custom Location',
      latitude: -33.8688,
      longitude: 151.2093,
      radius: 200,
    };
    
    const { getByText } = render(
      <GeofenceListItem geofence={customGeofence} onPress={mockOnPress} />,
    );
    
    expect(getByText('Custom Location')).toBeTruthy();
    expect(getByText('Latitud: -33.8688')).toBeTruthy();
    expect(getByText('Longitud: 151.2093')).toBeTruthy();
  });

  it('should render FavoriteButton component', () => {
    const { UNSAFE_getByType } = render(
      <GeofenceListItem geofence={mockGeofence} onPress={mockOnPress} />,
    );
    
    // Verificar que FavoriteButton está presente
    expect(() => UNSAFE_getByType(require('../../src/components/FavoriteButton').FavoriteButton)).not.toThrow();
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const customFavoriteStyle = { marginTop: 10 };
    
    const { UNSAFE_getByType } = render(
      <GeofenceListItem 
        geofence={mockGeofence} 
        onPress={mockOnPress}
        style={customStyle}
        favoriteIconStyle={customFavoriteStyle}
      />,
    );
    
    const touchable = UNSAFE_getByType(require('react-native').TouchableOpacity);
    expect(touchable.props.style).toEqual(customStyle);
  });

  it('should have correct activeOpacity on TouchableOpacity', () => {
    const { UNSAFE_getByType } = render(
      <GeofenceListItem geofence={mockGeofence} onPress={mockOnPress} />,
    );
    
    const touchable = UNSAFE_getByType(require('react-native').TouchableOpacity);
    expect(touchable.props.activeOpacity).toBe(0.8);
  });
});
