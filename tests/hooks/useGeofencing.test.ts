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

  it('should request location permission on mount', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    
    renderHook(() => useGeofencing());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(requestLocationPermission).toHaveBeenCalled();
  });

  it('should set hasPermission when permission is granted', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    requestLocationPermission.mockResolvedValue(true);
    
    renderHook(() => useGeofencing());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(Geolocation.watchPosition).toHaveBeenCalled();
  });

  it('should handle getCurrentPosition success', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    requestLocationPermission.mockResolvedValue(true);
    
    const mockPosition = {
      coords: { latitude: 40.7128, longitude: -74.006 }
    };
    
    Geolocation.getCurrentPosition.mockImplementation((success: any) => {
      success(mockPosition);
    });
    
    const { result } = renderHook(() => useGeofencing());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.currentLocation).toEqual({
      latitude: 40.7128,
      longitude: -74.006
    });
  });

  it('should handle getCurrentPosition error', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    requestLocationPermission.mockResolvedValue(true);
    
    const mockError = new Error('Location error');
    Geolocation.getCurrentPosition.mockImplementation((success: any, error: any) => {
      error(mockError);
    });
    
    const { result } = renderHook(() => useGeofencing());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Verificar que se logó el error (console.error está mockeado globalmente)
    expect(console.error).toHaveBeenCalledWith('Error obteniendo ubicación', mockError);
    // Verificar que el estado permanece null tras el error
    expect(result.current.currentLocation).toBeNull();
  });

  it('should handle watchPosition success', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    requestLocationPermission.mockResolvedValue(true);
    
    const mockPosition = {
      coords: { latitude: 41.0000, longitude: -75.0000 }
    };
    
    Geolocation.watchPosition.mockImplementation((success: any) => {
      success(mockPosition);
      return 123;
    });
    
    const { result } = renderHook(() => useGeofencing());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.currentLocation).toEqual({
      latitude: 41.0000,
      longitude: -75.0000
    });
  });

  it('should handle watchPosition error', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    requestLocationPermission.mockResolvedValue(true);
    
    const mockError = new Error('Watch position error');
    Geolocation.watchPosition.mockImplementation((success: any, error: any) => {
      error(mockError);
      return 123;
    });
    
    const { result } = renderHook(() => useGeofencing());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Verificar que se logó el error (console.error está mockeado globalmente)
    expect(console.error).toHaveBeenCalledWith('Error obteniendo ubicación', mockError);
    // Verificar que el estado permanece null tras el error
    expect(result.current.currentLocation).toBeNull();
  });

  it('should clear watch on unmount', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    requestLocationPermission.mockResolvedValue(true);
    Geolocation.watchPosition.mockReturnValue(123);
    
    const { unmount } = renderHook(() => useGeofencing());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    unmount();
    
    expect(Geolocation.clearWatch).toHaveBeenCalledWith(123);
  });

  it('should detect when inside geofence and trigger notification', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const { isWithinGeofence, triggerGeofenceNotification } = require('../../src/domain/usecases');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    // Setup: permisos y geofence
    requestLocationPermission.mockResolvedValue(true);
    mockGeofences.push(mockGeofence);
    isWithinGeofence.mockReturnValue(true);
    
    // Mock getCurrentPosition para establecer ubicación inicial
    const mockPosition = {
      coords: { latitude: 40.7128, longitude: -74.006 }
    };
    
    Geolocation.getCurrentPosition.mockImplementation((success: any) => {
      success(mockPosition);
    });
    
    const { result } = renderHook(() => useGeofencing());
    
    // Esperar a que se ejecuten los useEffects
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    expect(isWithinGeofence).toHaveBeenCalledWith(
      mockGeofence,
      40.7128,
      -74.006
    );
    expect(triggerGeofenceNotification).toHaveBeenCalledWith(
      'Has entrado a la zona!',
      'Has entrado a la zona objetivo'
    );
    expect(result.current.isInside).toBe(true);
  });

  it('should detect when outside geofence and trigger exit notification', async () => {
    const { requestLocationPermission } = require('../../src/utils/geo');
    const { isWithinGeofence, triggerGeofenceNotification } = require('../../src/domain/usecases');
    const Geolocation = require('@react-native-community/geolocation').default;
    
    requestLocationPermission.mockResolvedValue(true);
    mockGeofences.push(mockGeofence);
    
    let positionCallback: any;
    
    // Mock watchPosition para controlar cuándo se llama el callback
    Geolocation.watchPosition.mockImplementation((success: any) => {
      positionCallback = success;
      return 123;
    });
    
    const { result } = renderHook(() => useGeofencing());
    
    // Esperar setup inicial
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    // Simular entrada al geofence
    isWithinGeofence.mockReturnValue(true);
    await act(async () => {
      positionCallback({ coords: { latitude: 40.7128, longitude: -74.006 } });
    });
    
    // Limpiar mocks para el escenario de salida
    jest.clearAllMocks();
    
    // Simular salida del geofence
    isWithinGeofence.mockReturnValue(false);
    await act(async () => {
      positionCallback({ coords: { latitude: 41.0000, longitude: -75.0000 } });
    });
    
    expect(triggerGeofenceNotification).toHaveBeenCalledWith(
      'Has salido de la zona!',
      'Has salido de la zona objetivo'
    );
    expect(result.current.isInside).toBe(false);
  });
});
