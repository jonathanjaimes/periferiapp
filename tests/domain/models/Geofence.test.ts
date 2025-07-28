import { Geofence } from '../../../src/domain/models/Geofence';
import { Location } from '../../../src/domain/models/Location';

describe('Geofence', () => {
  it('should create a valid geofence with all required properties', () => {
    const geofence: Geofence = {
      id: '1',
      name: 'Test Geofence',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
    };

    expect(geofence.id).toBe('1');
    expect(geofence.name).toBe('Test Geofence');
    expect(geofence.latitude).toBe(40.7128);
    expect(geofence.longitude).toBe(-74.0060);
    expect(geofence.radius).toBe(100);
  });

  it('should extend Location interface', () => {
    const geofence: Geofence = {
      id: '2',
      name: 'Location Test',
      latitude: 51.5074,
      longitude: -0.1278,
      radius: 200,
    };

    // Verificar que Geofence puede ser usado como Location
    const location: Location = geofence;
    expect(location.latitude).toBe(51.5074);
    expect(location.longitude).toBe(-0.1278);
  });

  it('should validate geofence properties with different data types', () => {
    const geofence: Geofence = {
      id: 'uuid-123-456',
      name: 'Complex Geofence Name with Spaces & Symbols!',
      latitude: -34.6037, // Coordenadas negativas
      longitude: -58.3816,
      radius: 1500.5, // Radio con decimales
    };

    expect(typeof geofence.id).toBe('string');
    expect(typeof geofence.name).toBe('string');
    expect(typeof geofence.latitude).toBe('number');
    expect(typeof geofence.longitude).toBe('number');
    expect(typeof geofence.radius).toBe('number');

    expect(geofence.id.length).toBeGreaterThan(0);
    expect(geofence.name.length).toBeGreaterThan(0);
    expect(geofence.radius).toBeGreaterThan(0);
  });

  it('should handle edge cases for coordinates', () => {
    // Coordenadas en los límites geográficos
    const extremeGeofence: Geofence = {
      id: 'extreme-1',
      name: 'Extreme Coordinates',
      latitude: 90, // Polo Norte
      longitude: 180, // Límite de longitud
      radius: 1000,
    };

    expect(extremeGeofence.latitude).toBe(90);
    expect(extremeGeofence.longitude).toBe(180);
    expect(extremeGeofence.latitude).toBeLessThanOrEqual(90);
    expect(extremeGeofence.latitude).toBeGreaterThanOrEqual(-90);
    expect(extremeGeofence.longitude).toBeLessThanOrEqual(180);
    expect(extremeGeofence.longitude).toBeGreaterThanOrEqual(-180);
  });

  it('should handle negative coordinates (Southern/Western hemispheres)', () => {
    const southernGeofence: Geofence = {
      id: 'southern-1',
      name: 'Southern Hemisphere',
      latitude: -89.9999, // Cerca del Polo Sur
      longitude: -179.9999, // Hemisferio occidental
      radius: 500,
    };

    expect(southernGeofence.latitude).toBeLessThan(0);
    expect(southernGeofence.longitude).toBeLessThan(0);
    expect(southernGeofence.latitude).toBeGreaterThan(-90);
    expect(southernGeofence.longitude).toBeGreaterThan(-180);
  });

  it('should handle zero and decimal values', () => {
    const preciseGeofence: Geofence = {
      id: 'precise-1',
      name: 'Precise Location',
      latitude: 0, // Ecuador
      longitude: 0, // Meridiano de Greenwich
      radius: 0.5, // Radio muy pequeño
    };

    expect(preciseGeofence.latitude).toBe(0);
    expect(preciseGeofence.longitude).toBe(0);
    expect(preciseGeofence.radius).toBe(0.5);
    expect(preciseGeofence.radius).toBeGreaterThan(0);
  });

  it('should handle large radius values', () => {
    const largeGeofence: Geofence = {
      id: 'large-1',
      name: 'Large Coverage Area',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 50000, // 50 km
    };

    expect(largeGeofence.radius).toBe(50000);
    expect(largeGeofence.radius).toBeGreaterThan(1000);
  });

  it('should support different ID formats', () => {
    const geofences: Geofence[] = [
      {
        id: '1', // Numérico como string
        name: 'Numeric ID',
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
      },
      {
        id: 'uuid-12345-67890', // UUID-like
        name: 'UUID ID',
        latitude: 51.5074,
        longitude: -0.1278,
        radius: 200,
      },
      {
        id: 'geofence_home_001', // Descriptivo
        name: 'Descriptive ID',
        latitude: 35.6762,
        longitude: 139.6503,
        radius: 300,
      },
    ];

    geofences.forEach(geofence => {
      expect(typeof geofence.id).toBe('string');
      expect(geofence.id.length).toBeGreaterThan(0);
      expect(geofence.name.length).toBeGreaterThan(0);
    });
  });

  it('should support different name formats', () => {
    const geofences: Geofence[] = [
      {
        id: '1',
        name: 'Simple Name',
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
      },
      {
        id: '2',
        name: 'Name with Numbers 123',
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
      },
      {
        id: '3',
        name: 'Name with Special Characters! @#$%',
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
      },
      {
        id: '4',
        name: 'Very Long Name That Contains Multiple Words And Describes The Location In Detail',
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
      },
    ];

    geofences.forEach(geofence => {
      expect(typeof geofence.name).toBe('string');
      expect(geofence.name.length).toBeGreaterThan(0);
    });
  });

  it('should maintain object immutability when used as const', () => {
    const geofence: Geofence = {
      id: 'immutable-1',
      name: 'Immutable Geofence',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
    } as const;

    // Verificar que las propiedades mantienen sus valores
    expect(geofence.id).toBe('immutable-1');
    expect(geofence.name).toBe('Immutable Geofence');
    expect(geofence.latitude).toBe(40.7128);
    expect(geofence.longitude).toBe(-74.0060);
    expect(geofence.radius).toBe(100);
  });

  it('should be serializable to JSON', () => {
    const geofence: Geofence = {
      id: 'json-1',
      name: 'JSON Serializable',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
    };

    const jsonString = JSON.stringify(geofence);
    const parsedGeofence = JSON.parse(jsonString) as Geofence;

    expect(parsedGeofence.id).toBe(geofence.id);
    expect(parsedGeofence.name).toBe(geofence.name);
    expect(parsedGeofence.latitude).toBe(geofence.latitude);
    expect(parsedGeofence.longitude).toBe(geofence.longitude);
    expect(parsedGeofence.radius).toBe(geofence.radius);
  });

  it('should support array operations', () => {
    const geofences: Geofence[] = [
      {
        id: '1',
        name: 'First Geofence',
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 100,
      },
      {
        id: '2',
        name: 'Second Geofence',
        latitude: 51.5074,
        longitude: -0.1278,
        radius: 200,
      },
    ];

    expect(geofences).toHaveLength(2);
    expect(geofences[0].name).toBe('First Geofence');
    expect(geofences[1].name).toBe('Second Geofence');

    // Operaciones de array
    const names = geofences.map(g => g.name);
    expect(names).toEqual(['First Geofence', 'Second Geofence']);

    const largeGeofences = geofences.filter(g => g.radius > 150);
    expect(largeGeofences).toHaveLength(1);
    expect(largeGeofences[0].id).toBe('2');
  });

  it('should support object spread and destructuring', () => {
    const baseGeofence: Geofence = {
      id: 'base-1',
      name: 'Base Geofence',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
    };

    // Spread operator
    const modifiedGeofence: Geofence = {
      ...baseGeofence,
      name: 'Modified Geofence',
      radius: 200,
    };

    expect(modifiedGeofence.id).toBe('base-1');
    expect(modifiedGeofence.name).toBe('Modified Geofence');
    expect(modifiedGeofence.radius).toBe(200);
    expect(modifiedGeofence.latitude).toBe(40.7128);
    expect(modifiedGeofence.longitude).toBe(-74.0060);

    // Destructuring
    const { id, name, latitude, longitude, radius } = baseGeofence;
    expect(id).toBe('base-1');
    expect(name).toBe('Base Geofence');
    expect(latitude).toBe(40.7128);
    expect(longitude).toBe(-74.0060);
    expect(radius).toBe(100);
  });
});
