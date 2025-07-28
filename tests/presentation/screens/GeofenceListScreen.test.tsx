import React from 'react';
import { render } from '@testing-library/react-native';
import GeofenceListScreen from '../../../src/presentation/screens/GeofenceListScreen';

// Mock de navegación
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

// Mock de hooks
const mockUseGeofenceList = jest.fn();
jest.mock('../../../src/hooks/useGeofenceList', () => ({
  useGeofenceList: () => mockUseGeofenceList(),
}));

// Mock de useGeofenceListLogic
const mockSetQuery = jest.fn();
const mockSetInputFocused = jest.fn();
const mockHandleScroll = jest.fn();

jest.mock('../../../src/hooks/useGeofenceListLogic', () => ({
  useGeofenceListLogic: () => ({
    query: '',
    setQuery: mockSetQuery,
    inputFocused: false,
    setInputFocused: mockSetInputFocused,
    inputRef: { current: null },
    searchBarAnim: { interpolate: jest.fn(() => 0) },
    handleScroll: mockHandleScroll,
    filteredGeofences: [],
  }),
}));

// Mock de componentes
jest.mock('../../../src/components/GeofenceListItem', () => ({
  GeofenceListItem: 'GeofenceListItem',
}));

jest.mock('../../../src/presentation/components/UserSearchOverlay', () => 'UserSearchOverlay');

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

describe('GeofenceListScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseGeofenceList.mockReturnValue({
      geofences: [],
      isLoading: true,
      isError: false,
      navigation: mockNavigation,
    });

    const { getByText, UNSAFE_getByType } = render(<GeofenceListScreen />);
    
    // Verificar que se muestra el ActivityIndicator
    const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
    
    // Verificar el texto de loading
    expect(getByText('Cargando posiciones...')).toBeTruthy();
  });

  it('should render geofences list', () => {
    const mockGeofences = [
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

    mockUseGeofenceList.mockReturnValue({
      geofences: mockGeofences,
      isLoading: false,
      isError: false,
      navigation: mockNavigation,
    });

    const { UNSAFE_getByType } = render(<GeofenceListScreen />);
    
    // Verificar que se renderiza el FlatList
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    expect(flatList).toBeTruthy();
    
    // Verificar que el FlatList tiene los datos correctos
    expect(flatList.props.data).toEqual(mockGeofences);
  });

  it('should render empty state', () => {
    mockUseGeofenceList.mockReturnValue({
      geofences: [],
      isLoading: false,
      isError: false,
      navigation: mockNavigation,
    });

    const { getByText, UNSAFE_getByType } = render(<GeofenceListScreen />);
    
    // Verificar que se renderiza el FlatList
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    expect(flatList).toBeTruthy();
    
    // Verificar que el FlatList está vacío
    expect(flatList.props.data).toEqual([]);
    
    // Verificar el componente ListEmptyComponent
    expect(flatList.props.ListEmptyComponent).toBeTruthy();
  });

  it('should handle error state', () => {
    mockUseGeofenceList.mockReturnValue({
      geofences: [],
      isLoading: false,
      isError: true,
      navigation: mockNavigation,
    });

    const { getByText } = render(<GeofenceListScreen />);
    
    // Verificar que se muestra el mensaje de error
    expect(getByText('Error al cargar posiciones')).toBeTruthy();
  });

  it('should render search input', () => {
    mockUseGeofenceList.mockReturnValue({
      geofences: [],
      isLoading: false,
      isError: false,
      navigation: mockNavigation,
    });

    const { UNSAFE_getByType } = render(<GeofenceListScreen />);
    
    // Verificar que se renderiza el TextInput para búsqueda
    const textInput = UNSAFE_getByType(require('react-native').TextInput);
    expect(textInput).toBeTruthy();
    expect(textInput.props.placeholder).toBe('Buscar posición...');
  });

  it('should render with proper FlatList configuration', () => {
    const mockGeofences = [
      {
        id: '1',
        name: 'Casa',
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
      },
    ];

    mockUseGeofenceList.mockReturnValue({
      geofences: mockGeofences,
      isLoading: false,
      isError: false,
      navigation: mockNavigation,
    });

    const { UNSAFE_getByType } = render(<GeofenceListScreen />);
    
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    
    // Verificar configuración del FlatList
    expect(flatList.props.keyExtractor).toBeDefined();
    expect(flatList.props.renderItem).toBeDefined();
    expect(flatList.props.onScroll).toBeDefined();
    expect(flatList.props.scrollEventThrottle).toBe(16);
    expect(flatList.props.contentContainerStyle).toEqual({ paddingTop: 86 });
  });

  it('should handle text input interactions', () => {
    mockUseGeofenceList.mockReturnValue({
      geofences: [],
      isLoading: false,
      isError: false,
      navigation: mockNavigation,
    });

    const { UNSAFE_getByType } = render(<GeofenceListScreen />);
    
    const textInput = UNSAFE_getByType(require('react-native').TextInput);
    
    // Simular onChangeText
    textInput.props.onChangeText('test query');
    expect(mockSetQuery).toHaveBeenCalledWith('test query');
    
    // Simular onFocus
    textInput.props.onFocus();
    expect(mockSetInputFocused).toHaveBeenCalledWith(true);
    
    // Simular onBlur
    textInput.props.onBlur();
    expect(mockSetInputFocused).toHaveBeenCalledWith(false);
  });

  it('should handle TouchableOpacity interactions', () => {
    mockUseGeofenceList.mockReturnValue({
      geofences: [],
      isLoading: false,
      isError: false,
      navigation: mockNavigation,
    });

    const { UNSAFE_getAllByType } = render(<GeofenceListScreen />);
    
    // Verificar que hay TouchableOpacity elements (para los botones de búsqueda)
    const touchableOpacities = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
    expect(touchableOpacities.length).toBeGreaterThan(0);
    
    // Verificar que cada TouchableOpacity tiene una función onPress
    touchableOpacities.forEach(touchable => {
      expect(typeof touchable.props.onPress).toBe('function');
    });
  });
});
