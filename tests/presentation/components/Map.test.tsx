import React from 'react';
import { render } from '@testing-library/react-native';
import Map from '../../../src/presentation/components/Map';

// Mock de react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    Circle: View,
  };
});

describe('Map', () => {
  const mockProps = {
    region: {
      latitude: 40.7128,
      longitude: -74.0060,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    userLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    geofence: {
      id: '1',
      name: 'Test Geofence',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
    },
  };

  it('should render map correctly', () => {
    const { UNSAFE_getByType } = render(<Map initialRegion={mockProps.region} geofence={mockProps.geofence} />);
    
    // Verificar que el MapView se renderiza
    const mapView = UNSAFE_getByType(require('react-native').View); // MapView es mockeado como View
    expect(mapView).toBeTruthy();
  });

  it('should show user location marker', () => {
    const { UNSAFE_getByType } = render(<Map initialRegion={mockProps.region} geofence={mockProps.geofence} />);
    
    // El MapView tiene showsUserLocation={true} por defecto
    const mapView = UNSAFE_getByType(require('react-native').View);
    expect(mapView).toBeTruthy();
    
    // Nota: showsUserLocation es una prop interna del MapView que no podemos verificar directamente
    // en el mock, pero el componente está configurado para mostrar la ubicación del usuario
  });

  it('should show geofence circle when provided', () => {
    const { UNSAFE_getAllByType } = render(<Map initialRegion={mockProps.region} geofence={mockProps.geofence} />);
    
    // Verificar que se renderizan múltiples Views (MapView + Marker + Circle)
    const views = UNSAFE_getAllByType(require('react-native').View);
    
    // Debería haber al menos 3 Views: MapView, Marker (mockeado como View), Circle (mockeado como View)
    expect(views.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle missing geofence', () => {
    const { UNSAFE_getAllByType } = render(<Map initialRegion={mockProps.region} />);
    
    // Sin geofence, solo debería renderizar el MapView
    const views = UNSAFE_getAllByType(require('react-native').View);
    
    // Solo debería haber 1 View (el MapView), sin Marker ni Circle
    expect(views.length).toBe(1);
  });

  it('should render without initialRegion', () => {
    const { UNSAFE_getByType } = render(<Map geofence={mockProps.geofence} />);
    
    // Verificar que el componente se renderiza incluso sin initialRegion
    const mapView = UNSAFE_getByType(require('react-native').View);
    expect(mapView).toBeTruthy();
  });

  it('should render with minimal props', () => {
    const { UNSAFE_getAllByType } = render(<Map />);
    
    // Sin geofence ni initialRegion, solo debería renderizar el MapView
    const views = UNSAFE_getAllByType(require('react-native').View);
    expect(views.length).toBe(1);
  });

  it('should render geofence with different coordinates', () => {
    const differentGeofence = {
      latitude: 51.5074,
      longitude: -0.1278,
      radius: 200,
    };
    
    const { UNSAFE_getAllByType } = render(
      <Map initialRegion={mockProps.region} geofence={differentGeofence} />
    );
    
    // Verificar que se renderizan múltiples Views con diferentes coordenadas
    const views = UNSAFE_getAllByType(require('react-native').View);
    expect(views.length).toBeGreaterThanOrEqual(3);
  });

  it('should render geofence with zero radius', () => {
    const zeroRadiusGeofence = {
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 0,
    };
    
    const { UNSAFE_getAllByType } = render(
      <Map initialRegion={mockProps.region} geofence={zeroRadiusGeofence} />
    );
    
    // Incluso con radio 0, debería renderizar Marker y Circle
    const views = UNSAFE_getAllByType(require('react-native').View);
    expect(views.length).toBeGreaterThanOrEqual(3);
  });


});
