import {
  haversineDistance,
  getMapRegion,
  uuidv4,
  requestLocationPermission,
} from '../../src/utils/geo';
import { Platform, PermissionsAndroid, Dimensions } from 'react-native';

// Mock de React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios', // Default to iOS
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })), // iPhone dimensions
  },
}));

// Tests para funciones utilitarias geográficas
describe('Geo Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('haversineDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // Nueva York a Los Ángeles (aproximadamente 3944 km)
      const nyLat = 40.7128;
      const nyLon = -74.0060;
      const laLat = 34.0522;
      const laLon = -118.2437;
      
      const distance = haversineDistance(nyLat, nyLon, laLat, laLon);
      
      // Verificar que la distancia está en el rango esperado (±50km de margen)
      expect(distance).toBeGreaterThan(3900000); // 3900 km
      expect(distance).toBeLessThan(4000000); // 4000 km
    });

    it('should return 0 for identical coordinates', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      
      const distance = haversineDistance(lat, lon, lat, lon);
      
      expect(distance).toBe(0);
    });

    it('should handle coordinates at the equator', () => {
      const distance = haversineDistance(0, 0, 0, 1);
      
      // 1 grado de longitud en el ecuador ≈ 111.32 km (±500m tolerance)
      expect(distance).toBeGreaterThan(110800);
      expect(distance).toBeLessThan(111800);
    });

    it('should handle coordinates at the poles', () => {
      // Polo Norte a un punto cercano
      const distance = haversineDistance(90, 0, 89, 0);
      
      // 1 grado de latitud ≈ 111.32 km (±500m tolerance)
      expect(distance).toBeGreaterThan(110800);
      expect(distance).toBeLessThan(111800);
    });

    it('should handle negative coordinates', () => {
      // Buenos Aires a São Paulo
      const buenosAiresLat = -34.6037;
      const buenosAiresLon = -58.3816;
      const saoPauloLat = -23.5505;
      const saoPauloLon = -46.6333;
      
      const distance = haversineDistance(
        buenosAiresLat, buenosAiresLon,
        saoPauloLat, saoPauloLon
      );
      
      // Distancia aproximada: 1200-1700 km (ciudades sudamericanas)
      expect(distance).toBeGreaterThan(1100000);
      expect(distance).toBeLessThan(1800000);
    });

    it('should handle extreme longitude differences', () => {
      // Mismo punto pero cruzando la línea de fecha internacional
      const distance = haversineDistance(0, 179, 0, -179);
      
      // Debería ser una distancia muy pequeña (2 grados ≈ 222 km, ±500m tolerance)
      expect(distance).toBeGreaterThan(222000);
      expect(distance).toBeLessThan(223000);
    });
  });

  describe('getMapRegion', () => {
    it('should calculate map region correctly', () => {
      const mockDimensions = { width: 375, height: 667 };
      (Dimensions.get as jest.Mock).mockReturnValue(mockDimensions);
      
      const region = getMapRegion({
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 1000, // 1km
      });
      
      expect(region.latitude).toBe(40.7128);
      expect(region.longitude).toBe(-74.0060);
      expect(region.latitudeDelta).toBeCloseTo(0.0198, 3); // (1/111) * 2.2
      expect(region.longitudeDelta).toBeGreaterThan(0);
    });

    it('should handle different radius values', () => {
      const region1km = getMapRegion({
        latitude: 0,
        longitude: 0,
        radius: 1000,
      });
      
      const region5km = getMapRegion({
        latitude: 0,
        longitude: 0,
        radius: 5000,
      });
      
      // El delta debería ser 5 veces mayor para 5km vs 1km
      expect(region5km.latitudeDelta).toBeCloseTo(region1km.latitudeDelta * 5, 3);
    });

    it('should handle zero radius', () => {
      const region = getMapRegion({
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 0,
      });
      
      expect(region.latitudeDelta).toBe(0);
      expect(region.longitudeDelta).toBe(0);
    });

    it('should adapt to different screen dimensions', () => {
      // Pantalla más ancha
      (Dimensions.get as jest.Mock).mockReturnValue({ width: 800, height: 600 });
      
      const wideRegion = getMapRegion({
        latitude: 0,
        longitude: 0,
        radius: 1000,
      });
      
      // Pantalla más alta
      (Dimensions.get as jest.Mock).mockReturnValue({ width: 400, height: 800 });
      
      const tallRegion = getMapRegion({
        latitude: 0,
        longitude: 0,
        radius: 1000,
      });
      
      // La pantalla ancha debería tener menor longitudeDelta
      expect(wideRegion.longitudeDelta).toBeLessThan(tallRegion.longitudeDelta);
    });
  });

  describe('uuidv4', () => {
    it('should generate a valid UUID v4 format', () => {
      const uuid = uuidv4();
      
      // Formato UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = uuidv4();
      const uuid2 = uuidv4();
      const uuid3 = uuidv4();
      
      expect(uuid1).not.toBe(uuid2);
      expect(uuid2).not.toBe(uuid3);
      expect(uuid1).not.toBe(uuid3);
    });

    it('should always have version 4 indicator', () => {
      // Generar múltiples UUIDs para verificar consistencia
      for (let i = 0; i < 10; i++) {
        const uuid = uuidv4();
        
        // El carácter 14 (índice 14) debe ser '4'
        expect(uuid[14]).toBe('4');
        
        // El carácter 19 (índice 19) debe ser 8, 9, a, o b
        expect(['8', '9', 'a', 'b']).toContain(uuid[19]);
      }
    });

    it('should have correct length and format', () => {
      const uuid = uuidv4();
      
      expect(uuid).toHaveLength(36);
      expect(uuid.split('-')).toHaveLength(5);
      expect(uuid.split('-')[0]).toHaveLength(8);
      expect(uuid.split('-')[1]).toHaveLength(4);
      expect(uuid.split('-')[2]).toHaveLength(4);
      expect(uuid.split('-')[3]).toHaveLength(4);
      expect(uuid.split('-')[4]).toHaveLength(12);
    });
  });

  describe('requestLocationPermission', () => {
    it('should return true for iOS platform', async () => {
      (Platform as any).OS = 'ios';
      
      const result = await requestLocationPermission();
      
      expect(result).toBe(true);
      expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    });

    it('should request permission on Android and return true when granted', async () => {
      (Platform as any).OS = 'android';
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.GRANTED
      );
      
      const result = await requestLocationPermission();
      
      expect(result).toBe(true);
      expect(PermissionsAndroid.request).toHaveBeenCalledWith(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        expect.objectContaining({
          title: 'Permiso de ubicación',
          message: 'Necesitamos tu ubicación para mostrar el mapa y tu posición',
        })
      );
    });

    it('should return false when Android permission is denied', async () => {
      (Platform as any).OS = 'android';
      (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
        PermissionsAndroid.RESULTS.DENIED
      );
      
      const result = await requestLocationPermission();
      
      expect(result).toBe(false);
    });

    it('should handle Android permission request errors', async () => {
      (Platform as any).OS = 'android';
      (PermissionsAndroid.request as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );
      
      // Mock console.warn to avoid console output in tests
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = await requestLocationPermission();
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});
