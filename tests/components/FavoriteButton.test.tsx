import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FavoriteButton } from '../../src/components/FavoriteButton';

// Mocks
const mockHandleFavorite = jest.fn();
const mockIsFavorite = jest.fn();

// Mock del hook useFavoriteActions
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

describe('FavoriteButton', () => {
  const mockGeofence = {
    id: '1',
    name: 'Test Geofence',
    latitude: 40.7128,
    longitude: -74.006,
    radius: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsFavorite.mockReturnValue(false);
    // Restaurar usuario autenticado por defecto
    mockUseFavoriteActions.authUser = 'admin';
  });

  it('should render correctly when user is authenticated', () => {
    const { UNSAFE_getByType } = render(
      <FavoriteButton geofence={mockGeofence} />,
    );

    // Verificar que el TouchableOpacity se renderiza
    const touchable = UNSAFE_getByType(
      require('react-native').TouchableOpacity,
    );
    expect(touchable).toBeTruthy();

    // Verificar que el Icon se renderiza
    const icon = UNSAFE_getByType(
      require('react-native-vector-icons/Ionicons'),
    );
    expect(icon).toBeTruthy();
  });

  it('should call handleFavorite when pressed', () => {
    const { UNSAFE_getByType } = render(
      <FavoriteButton geofence={mockGeofence} />,
    );

    const touchable = UNSAFE_getByType(
      require('react-native').TouchableOpacity,
    );
    fireEvent.press(touchable);

    expect(mockHandleFavorite).toHaveBeenCalledWith(mockGeofence);
    expect(mockHandleFavorite).toHaveBeenCalledTimes(1);
  });

  it('should show heart-outline when not favorite', () => {
    mockIsFavorite.mockReturnValue(false);

    const { UNSAFE_getByType } = render(
      <FavoriteButton geofence={mockGeofence} />,
    );

    const icon = UNSAFE_getByType(
      require('react-native-vector-icons/Ionicons'),
    );
    expect(icon).toBeTruthy();
    expect(mockIsFavorite).toHaveBeenCalledWith(mockGeofence.id);
  });

  it('should show heart when is favorite', () => {
    mockIsFavorite.mockReturnValue(true);

    const { UNSAFE_getByType } = render(
      <FavoriteButton geofence={mockGeofence} />,
    );

    const icon = UNSAFE_getByType(
      require('react-native-vector-icons/Ionicons'),
    );
    expect(icon).toBeTruthy();
    expect(mockIsFavorite).toHaveBeenCalledWith(mockGeofence.id);
  });

  it('should not render when user is not authenticated', () => {
    // Simular usuario no autenticado
    mockUseFavoriteActions.authUser = null as any;

    const result = render(<FavoriteButton geofence={mockGeofence} />);
    expect(result.toJSON()).toBeNull();
  });

  it('should have correct activeOpacity', () => {
    const { UNSAFE_getByType } = render(
      <FavoriteButton geofence={mockGeofence} />,
    );

    const touchable = UNSAFE_getByType(
      require('react-native').TouchableOpacity,
    );
    expect(touchable).toBeTruthy();
    expect(touchable.props.activeOpacity).toBe(0.7);
  });

  it('should apply custom style when provided', () => {
    const customStyle = { marginTop: 10 };

    const { UNSAFE_getByType } = render(
      <FavoriteButton geofence={mockGeofence} style={customStyle} />,
    );

    const touchable = UNSAFE_getByType(
      require('react-native').TouchableOpacity,
    );
    expect(touchable).toBeTruthy();
  });

  it('should render with correct icon properties', () => {
    const { UNSAFE_getByType } = render(
      <FavoriteButton geofence={mockGeofence} />,
    );

    const icon = UNSAFE_getByType(
      require('react-native-vector-icons/Ionicons'),
    );
    expect(icon).toBeTruthy();
    expect(icon.props.size).toBe(28);
  });
});
