import { renderHook, act } from '@testing-library/react-native';
import { useGeofencing } from '../../src/hooks/useGeofencing';

// Mock completo de todas las dependencias
jest.mock('react-native-push-notification', () => ({
  localNotification: jest.fn(),
  configure: jest.fn(),
  requestPermissions: jest.fn(),
}));

jest.mock('@react-native-community/geolocation', () => ({
  __esModule: true,
  default: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(() => 123),
    clearWatch: jest.fn(),
  },
}));

jest.mock('../../src/domain/usecases', () => ({
  saveGeofence: jest.fn().mockResolvedValue(undefined),
  isWithinGeofence: jest.fn().mockReturnValue(false),
  triggerGeofenceNotification: jest.fn(),
}));

jest.mock('../../src/utils/geo', () => ({
  requestLocationPermission: jest.fn().mockResolvedValue(false),
}));

const mockGeofences: any[] = [];
const mockAddGeofence = jest.fn();

jest.mock('../../src/store/geofenceStore', () => ({
  useGeofenceStore: (selector: any) => {
    const store = {
      geofences: mockGeofences,
      addGeofence: mockAddGeofence,
    };
    return selector(store);
  },
}));

describe('useGeofencing', () => {
  const mockGeofence = {
    id: '1',
    name: 'Test Geofence',
    latitude: 40.7128,
    longitude: -74.006,
    radius: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGeofences.length = 0;
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGeofencing());

    expect(result.current.currentLocation).toBeNull();
    expect(result.current.isInside).toBe(false);
    expect(result.current.geofence).toBeUndefined();
    expect(typeof result.current.updateGeofence).toBe('function');
  });

  it('should return geofence from store when available', () => {
    mockGeofences.push(mockGeofence);
    
    const { result } = renderHook(() => useGeofencing());
    
    expect(result.current.geofence).toEqual(mockGeofence);
  });

  it('should return last geofence when multiple exist', () => {
    const firstGeofence = { ...mockGeofence, id: '1', name: 'First' };
    const secondGeofence = { ...mockGeofence, id: '2', name: 'Second' };
    
    mockGeofences.push(firstGeofence, secondGeofence);
    
    const { result } = renderHook(() => useGeofencing());
    
    expect(result.current.geofence).toEqual(secondGeofence);
  });

  it('should call updateGeofence correctly', async () => {
    const { saveGeofence } = require('../../src/domain/usecases');
    const { result } = renderHook(() => useGeofencing());

    await act(async () => {
      await result.current.updateGeofence(mockGeofence);
    });

    expect(saveGeofence).toHaveBeenCalledWith('admin', mockGeofence);
    expect(mockAddGeofence).toHaveBeenCalledWith(mockGeofence);
  });

  it('should not throw errors during initialization', () => {
    expect(() => renderHook(() => useGeofencing())).not.toThrow();
  });

  it('should handle empty geofences array', () => {
    // mockGeofences está vacío por defecto
    const { result } = renderHook(() => useGeofencing());
    
    expect(result.current.geofence).toBeUndefined();
  });
});
