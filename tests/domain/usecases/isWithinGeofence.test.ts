import { isWithinGeofence } from '../../../src/domain/usecases/isWithinGeofence';
import { Geofence } from '../../../src/domain/models/Geofence';
import { haversineDistance } from '../../../src/utils/geo';

// Mock de la función haversineDistance para control preciso en tests
jest.mock('../../../src/utils/geo', () => ({
  ...jest.requireActual('../../../src/utils/geo'),
  haversineDistance: jest.fn(),
}));

const mockHaversineDistance = haversineDistance as jest.MockedFunction<typeof haversineDistance>;

describe('isWithinGeofence', () => {
  const mockGeofence: Geofence = {
    id: '1',
    name: 'Test Geofence',
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 100, // 100 metros
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when location is within geofence', () => {
    const userLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
    };
    
    // Mock: distancia de 0 metros (misma ubicación)
    mockHaversineDistance.mockReturnValue(0);

    const result = isWithinGeofence(mockGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLocation.latitude,
      userLocation.longitude,
      mockGeofence.latitude,
      mockGeofence.longitude
    );
    expect(mockHaversineDistance).toHaveBeenCalledTimes(1);
  });

  it('should return true when location is exactly at the boundary', () => {
    const userLocation = {
      latitude: 40.7129,
      longitude: -74.0061,
    };
    
    // Mock: distancia exactamente igual al radio
    mockHaversineDistance.mockReturnValue(100);

    const result = isWithinGeofence(mockGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLocation.latitude,
      userLocation.longitude,
      mockGeofence.latitude,
      mockGeofence.longitude
    );
  });

  it('should return false when location is outside geofence', () => {
    const userLocation = {
      latitude: 41.0000,
      longitude: -75.0000,
    };
    
    // Mock: distancia mayor al radio (150 metros)
    mockHaversineDistance.mockReturnValue(150);

    const result = isWithinGeofence(mockGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(false);
    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLocation.latitude,
      userLocation.longitude,
      mockGeofence.latitude,
      mockGeofence.longitude
    );
    expect(mockHaversineDistance).toHaveBeenCalledTimes(1);
  });

  it('should return false when location is just outside the boundary', () => {
    const userLocation = {
      latitude: 40.7130,
      longitude: -74.0062,
    };
    
    // Mock: distancia ligeramente mayor al radio (100.1 metros)
    mockHaversineDistance.mockReturnValue(100.1);

    const result = isWithinGeofence(mockGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(false);
    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLocation.latitude,
      userLocation.longitude,
      mockGeofence.latitude,
      mockGeofence.longitude
    );
  });

  it('should handle edge cases at boundary', () => {
    const userLocation = {
      latitude: 40.7127,
      longitude: -74.0059,
    };
    
    // Mock: distancia muy cercana al límite (99.9 metros)
    mockHaversineDistance.mockReturnValue(99.9);

    const result = isWithinGeofence(mockGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLocation.latitude,
      userLocation.longitude,
      mockGeofence.latitude,
      mockGeofence.longitude
    );
  });

  it('should handle zero radius geofence', () => {
    const zeroRadiusGeofence: Geofence = {
      ...mockGeofence,
      radius: 0,
    };
    
    const userLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
    };
    
    // Mock: distancia de 0 metros (misma ubicación)
    mockHaversineDistance.mockReturnValue(0);

    const result = isWithinGeofence(zeroRadiusGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
  });

  it('should handle zero radius geofence with different location', () => {
    const zeroRadiusGeofence: Geofence = {
      ...mockGeofence,
      radius: 0,
    };
    
    const userLocation = {
      latitude: 40.7129,
      longitude: -74.0061,
    };
    
    // Mock: cualquier distancia mayor a 0
    mockHaversineDistance.mockReturnValue(1);

    const result = isWithinGeofence(zeroRadiusGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(false);
  });

  it('should handle large radius geofence', () => {
    const largeRadiusGeofence: Geofence = {
      ...mockGeofence,
      radius: 10000, // 10 km
    };
    
    const userLocation = {
      latitude: 41.0000,
      longitude: -75.0000,
    };
    
    // Mock: distancia de 5 km (dentro del radio de 10 km)
    mockHaversineDistance.mockReturnValue(5000);

    const result = isWithinGeofence(largeRadiusGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
  });

  it('should handle negative coordinates', () => {
    const negativeCoordGeofence: Geofence = {
      ...mockGeofence,
      latitude: -34.6037,
      longitude: -58.3816, // Buenos Aires
    };
    
    const userLocation = {
      latitude: -34.6038,
      longitude: -58.3817,
    };
    
    // Mock: distancia pequeña dentro del radio
    mockHaversineDistance.mockReturnValue(50);

    const result = isWithinGeofence(negativeCoordGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLocation.latitude,
      userLocation.longitude,
      negativeCoordGeofence.latitude,
      negativeCoordGeofence.longitude
    );
  });

  it('should handle extreme coordinate values', () => {
    const extremeGeofence: Geofence = {
      ...mockGeofence,
      latitude: 89.9999, // Cerca del polo norte
      longitude: 179.9999,
    };
    
    const userLocation = {
      latitude: 89.9998,
      longitude: 179.9998,
    };
    
    // Mock: distancia dentro del radio
    mockHaversineDistance.mockReturnValue(80);

    const result = isWithinGeofence(extremeGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
  });

  it('should pass correct parameters to haversineDistance', () => {
    const userLat = 40.7130;
    const userLon = -74.0062;
    
    mockHaversineDistance.mockReturnValue(50);

    isWithinGeofence(mockGeofence, userLat, userLon);

    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLat,
      userLon,
      mockGeofence.latitude,
      mockGeofence.longitude
    );
    
    // Verificar que los parámetros son exactamente los esperados
    const [calledUserLat, calledUserLon, calledGeofenceLat, calledGeofenceLon] = 
      mockHaversineDistance.mock.calls[0];
    
    expect(calledUserLat).toBe(userLat);
    expect(calledUserLon).toBe(userLon);
    expect(calledGeofenceLat).toBe(mockGeofence.latitude);
    expect(calledGeofenceLon).toBe(mockGeofence.longitude);
  });

  it('should work with different geofence configurations', () => {
    const differentGeofence: Geofence = {
      id: '2',
      name: 'Different Geofence',
      latitude: 51.5074, // Londres
      longitude: -0.1278,
      radius: 500,
    };
    
    const userLocation = {
      latitude: 51.5075,
      longitude: -0.1279,
    };
    
    mockHaversineDistance.mockReturnValue(300);

    const result = isWithinGeofence(differentGeofence, userLocation.latitude, userLocation.longitude);

    expect(result).toBe(true);
    expect(mockHaversineDistance).toHaveBeenCalledWith(
      userLocation.latitude,
      userLocation.longitude,
      differentGeofence.latitude,
      differentGeofence.longitude
    );
  });
});
