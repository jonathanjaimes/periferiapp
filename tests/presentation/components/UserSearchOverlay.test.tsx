import React from 'react';
import { render } from '@testing-library/react-native';
import UserSearchOverlay from '../../../src/presentation/components/UserSearchOverlay';
import { Geofence } from '../../../src/domain/models/Geofence';

describe('UserSearchOverlay', () => {
  const mockGeofences: Geofence[] = [
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

  const mockProps = {
    results: mockGeofences,
    onSelect: jest.fn(),
    onClose: jest.fn(),
    query: 'test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with search results', () => {
    const { getByText } = render(<UserSearchOverlay {...mockProps} />);
    
    expect(getByText('Casa')).toBeTruthy();
    expect(getByText('Trabajo')).toBeTruthy();
  });

  it('should render no results message when query exists but no results', () => {
    const { getByText } = render(
      <UserSearchOverlay 
        {...mockProps} 
        results={[]} 
        query="no results" 
      />
    );
    
    expect(getByText('No hay resultados')).toBeTruthy();
  });

  it('should render nothing when no query and no results', () => {
    const { queryByText } = render(
      <UserSearchOverlay 
        {...mockProps} 
        results={[]} 
        query="" 
      />
    );
    
    expect(queryByText('No hay resultados')).toBeNull();
  });

  it('should call onSelect when item is pressed', () => {
    const { UNSAFE_getAllByType } = render(<UserSearchOverlay {...mockProps} />);
    
    // Obtener todos los TouchableOpacity (items + backdrop)
    const touchableOpacities = UNSAFE_getAllByType(require('react-native').TouchableOpacity as any);
    
    // El primer TouchableOpacity es el item "Casa"
    const casaItem = touchableOpacities[0];
    casaItem.props.onPress();
    
    expect(mockProps.onSelect).toHaveBeenCalledWith(mockGeofences[0]);
  });

  it('should call onClose when backdrop is pressed', () => {
    const { UNSAFE_getAllByType } = render(<UserSearchOverlay {...mockProps} />);
    
    // El backdrop es el último TouchableOpacity
    const touchableOpacities = UNSAFE_getAllByType(require('react-native').TouchableOpacity as any);
    const backdrop = touchableOpacities[touchableOpacities.length - 1];
    
    backdrop.props.onPress();
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should generate correct keyExtractor for FlatList items', () => {
    const { UNSAFE_getByType } = render(<UserSearchOverlay {...mockProps} />);
    
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    const keyExtractor = flatList.props.keyExtractor;
    
    const expectedKey = mockGeofences[0].latitude.toString() + 
                       mockGeofences[0].longitude.toString() + 
                       mockGeofences[0].radius.toString();
    
    expect(keyExtractor(mockGeofences[0])).toBe(expectedKey);
  });

  it('should have keyboardShouldPersistTaps handled', () => {
    const { UNSAFE_getByType } = render(<UserSearchOverlay {...mockProps} />);
    
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    
    expect(flatList.props.keyboardShouldPersistTaps).toBe('handled');
  });

  it('should render with single result', () => {
    const singleResult = [mockGeofences[0]];
    const { getByText, queryByText } = render(
      <UserSearchOverlay {...mockProps} results={singleResult} />
    );
    
    expect(getByText('Casa')).toBeTruthy();
    expect(queryByText('Trabajo')).toBeNull();
  });

  it('should handle empty geofence name', () => {
    const geofenceWithEmptyName: Geofence = {
      id: '3',
      name: '',
      latitude: 41.0000,
      longitude: -75.0000,
      radius: 150,
    };
    
    const { getByText } = render(
      <UserSearchOverlay 
        {...mockProps} 
        results={[geofenceWithEmptyName]} 
      />
    );
    
    // Debería renderizar el texto vacío sin crashear
    expect(getByText('')).toBeTruthy();
  });

  it('should handle different coordinate formats', () => {
    const geofenceWithDecimals: Geofence = {
      id: '4',
      name: 'Decimal Coords',
      latitude: 40.123456,
      longitude: -74.987654,
      radius: 50,
    };
    
    const { UNSAFE_getByType } = render(
      <UserSearchOverlay 
        {...mockProps} 
        results={[geofenceWithDecimals]} 
      />
    );
    
    const flatList = UNSAFE_getByType(require('react-native').FlatList);
    const keyExtractor = flatList.props.keyExtractor;
    
    const expectedKey = '40.123456-74.98765450';
    expect(keyExtractor(geofenceWithDecimals)).toBe(expectedKey);
  });
});
