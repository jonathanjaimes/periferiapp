import { renderHook, act } from '@testing-library/react-native';
import { useGeofenceForm } from '../../src/hooks/useGeofenceForm';
import { Location } from '../../src/domain/models/Location';

// Mock del caso de uso
jest.mock('../../src/domain/usecases/saveGeofence', () => ({
  saveGeofence: jest.fn(),
}));

// Mock de uuidv4 para tener IDs predecibles en tests
jest.mock('../../src/utils/geo', () => ({
  ...jest.requireActual('../../src/utils/geo'),
  uuidv4: jest.fn(() => 'test-uuid-123'),
}));

describe('useGeofenceForm', () => {
  const mockLocation: Location = {
    latitude: 40.7128,
    longitude: -74.0060
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGeofenceForm(mockLocation));

    expect(result.current.latitude).toBe('');
    expect(result.current.longitude).toBe('');
    expect(result.current.radius).toBe('');
    expect(result.current.name).toBe('');
    expect(result.current.useCurrentLocation).toBe(false);
    expect(result.current.id).toBe('test-uuid-123');
    expect(typeof result.current.setLatitude).toBe('function');
    expect(typeof result.current.setLongitude).toBe('function');
    expect(typeof result.current.setRadius).toBe('function');
    expect(typeof result.current.setName).toBe('function');
    expect(typeof result.current.setUseCurrentLocation).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should initialize with null location', () => {
    const { result } = renderHook(() => useGeofenceForm(null));

    expect(result.current.latitude).toBe('');
    expect(result.current.longitude).toBe('');
    expect(result.current.radius).toBe('');
    expect(result.current.name).toBe('');
    expect(result.current.useCurrentLocation).toBe(false);
    expect(result.current.id).toBe('test-uuid-123');
  });

  it('should update form fields correctly', () => {
    const { result } = renderHook(() => useGeofenceForm(mockLocation));

    act(() => {
      result.current.setLatitude('41.0000');
    });
    expect(result.current.latitude).toBe('41.0000');

    act(() => {
      result.current.setLongitude('-75.0000');
    });
    expect(result.current.longitude).toBe('-75.0000');

    act(() => {
      result.current.setRadius('500');
    });
    expect(result.current.radius).toBe('500');

    act(() => {
      result.current.setName('Test Geofence');
    });
    expect(result.current.name).toBe('Test Geofence');
  });

  it('should update useCurrentLocation flag', () => {
    const { result } = renderHook(() => useGeofenceForm(mockLocation));

    expect(result.current.useCurrentLocation).toBe(false);

    act(() => {
      result.current.setUseCurrentLocation(true);
    });
    expect(result.current.useCurrentLocation).toBe(true);

    act(() => {
      result.current.setUseCurrentLocation(false);
    });
    expect(result.current.useCurrentLocation).toBe(false);
  });

  it('should set coordinates when useCurrentLocation is enabled and location is available', () => {
    const { result } = renderHook(() => useGeofenceForm(mockLocation));

    act(() => {
      result.current.setUseCurrentLocation(true);
    });

    expect(result.current.latitude).toBe('40.7128');
    expect(result.current.longitude).toBe('-74.006');
  });

  it('should not set coordinates when useCurrentLocation is enabled but location is null', () => {
    const { result } = renderHook(() => useGeofenceForm(null));

    act(() => {
      result.current.setUseCurrentLocation(true);
    });

    expect(result.current.latitude).toBe('');
    expect(result.current.longitude).toBe('');
  });

  it('should update coordinates when location changes and useCurrentLocation is enabled', () => {
    const { result, rerender } = renderHook(
      ({ location }) => useGeofenceForm(location),
      {
        initialProps: { location: mockLocation }
      }
    );

    act(() => {
      result.current.setUseCurrentLocation(true);
    });

    expect(result.current.latitude).toBe('40.7128');
    expect(result.current.longitude).toBe('-74.006');

    const newLocation: Location = {
      latitude: 41.0000,
      longitude: -75.0000
    };

    rerender({ location: newLocation });

    expect(result.current.latitude).toBe('41');
    expect(result.current.longitude).toBe('-75');
  });

  it('should reset form to default values', () => {
    const { result } = renderHook(() => useGeofenceForm(mockLocation));

    // Establecer algunos valores (sin useCurrentLocation para evitar el useEffect)
    act(() => {
      result.current.setLatitude('41.0000');
      result.current.setLongitude('-75.0000');
      result.current.setRadius('500');
      result.current.setName('Test Geofence');
    });

    // Verificar que los valores se establecieron
    expect(result.current.latitude).toBe('41.0000');
    expect(result.current.longitude).toBe('-75.0000');
    expect(result.current.radius).toBe('500');
    expect(result.current.name).toBe('Test Geofence');

    // Resetear el formulario
    act(() => {
      result.current.reset();
    });

    // Verificar que todos los valores volvieron a su estado inicial
    expect(result.current.latitude).toBe('');
    expect(result.current.longitude).toBe('');
    expect(result.current.radius).toBe('');
    expect(result.current.name).toBe('Test Geofence'); // name NO se resetea según el código
    expect(result.current.useCurrentLocation).toBe(false);
    expect(result.current.id).toBe('test-uuid-123'); // Se genera nuevo ID
  });

  it('should reset useCurrentLocation and coordinates', () => {
    const { result } = renderHook(() => useGeofenceForm(mockLocation));

    // Habilitar useCurrentLocation (esto establecerá las coordenadas automáticamente)
    act(() => {
      result.current.setUseCurrentLocation(true);
    });

    // Verificar que las coordenadas se establecieron por el useEffect
    expect(result.current.latitude).toBe('40.7128');
    expect(result.current.longitude).toBe('-74.006');
    expect(result.current.useCurrentLocation).toBe(true);

    // Resetear el formulario
    act(() => {
      result.current.reset();
    });

    // Verificar que useCurrentLocation se deshabilitó y las coordenadas se limpiaron
    expect(result.current.latitude).toBe('');
    expect(result.current.longitude).toBe('');
    expect(result.current.useCurrentLocation).toBe(false);
  });

  it('should maintain stable function references for setters', () => {
    const { result, rerender } = renderHook(() => useGeofenceForm(mockLocation));

    const initialSetLatitude = result.current.setLatitude;
    const initialSetLongitude = result.current.setLongitude;
    const initialSetRadius = result.current.setRadius;
    const initialSetName = result.current.setName;
    const initialSetUseCurrentLocation = result.current.setUseCurrentLocation;

    rerender({});

    // Los setters de useState son estables
    expect(result.current.setLatitude).toBe(initialSetLatitude);
    expect(result.current.setLongitude).toBe(initialSetLongitude);
    expect(result.current.setRadius).toBe(initialSetRadius);
    expect(result.current.setName).toBe(initialSetName);
    expect(result.current.setUseCurrentLocation).toBe(initialSetUseCurrentLocation);
  });

  it('should recreate reset function on each render', () => {
    const { result, rerender } = renderHook(() => useGeofenceForm(mockLocation));

    const initialReset = result.current.reset;

    rerender({});

    // La función reset se recrea en cada render (no es estable)
    expect(result.current.reset).not.toBe(initialReset);
    expect(typeof result.current.reset).toBe('function');
  });

  it('should handle location updates when useCurrentLocation is disabled', () => {
    const { result, rerender } = renderHook(
      ({ location }) => useGeofenceForm(location),
      {
        initialProps: { location: mockLocation }
      }
    );

    // Establecer coordenadas manualmente
    act(() => {
      result.current.setLatitude('41.0000');
      result.current.setLongitude('-75.0000');
    });

    const newLocation: Location = {
      latitude: 42.0000,
      longitude: -76.0000
    };

    rerender({ location: newLocation });

    // Las coordenadas no deben cambiar si useCurrentLocation está deshabilitado
    expect(result.current.latitude).toBe('41.0000');
    expect(result.current.longitude).toBe('-75.0000');
  });
});
