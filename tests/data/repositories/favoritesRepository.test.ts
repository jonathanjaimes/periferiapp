import { favoritesRepository } from '../../../src/data/repositories/favoritesRepository';
import { Geofence } from '../../../src/domain/models/Geofence';
import {
  getFavoritesForUserApi,
  addFavoriteApi,
  removeFavoriteApi,
} from '../../../src/data/api/favoritesApi';

// Mock de la API de favoritos
jest.mock('../../../src/data/api/favoritesApi', () => ({
  getFavoritesForUserApi: jest.fn(),
  addFavoriteApi: jest.fn(),
  removeFavoriteApi: jest.fn(),
}));

const mockGetFavoritesForUserApi = getFavoritesForUserApi as jest.MockedFunction<typeof getFavoritesForUserApi>;
const mockAddFavoriteApi = addFavoriteApi as jest.MockedFunction<typeof addFavoriteApi>;
const mockRemoveFavoriteApi = removeFavoriteApi as jest.MockedFunction<typeof removeFavoriteApi>;

describe('favoritesRepository', () => {
  const mockUsername = 'testuser@example.com';
  const mockGeofence: Geofence = {
    id: '1',
    name: 'Test Geofence',
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 100,
  };

  const mockFavoritesList: Geofence[] = [
    mockGeofence,
    {
      id: '2',
      name: 'Second Geofence',
      latitude: 51.5074,
      longitude: -0.1278,
      radius: 200,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFavorites', () => {
    it('should get favorites successfully', async () => {
      mockGetFavoritesForUserApi.mockResolvedValue(mockFavoritesList);

      const result = await favoritesRepository.getFavorites(mockUsername);

      expect(result).toEqual(mockFavoritesList);
      expect(mockGetFavoritesForUserApi).toHaveBeenCalledWith(mockUsername);
      expect(mockGetFavoritesForUserApi).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no favorites exist', async () => {
      mockGetFavoritesForUserApi.mockResolvedValue([]);

      const result = await favoritesRepository.getFavorites(mockUsername);

      expect(result).toEqual([]);
      expect(mockGetFavoritesForUserApi).toHaveBeenCalledWith(mockUsername);
    });

    it('should handle API errors in getFavorites', async () => {
      const apiError = new Error('API Error');
      mockGetFavoritesForUserApi.mockRejectedValue(apiError);

      await expect(favoritesRepository.getFavorites(mockUsername)).rejects.toThrow('API Error');
      expect(mockGetFavoritesForUserApi).toHaveBeenCalledWith(mockUsername);
    });

    it('should work with different usernames', async () => {
      const differentUsername = 'anotheruser@example.com';
      mockGetFavoritesForUserApi.mockResolvedValue([mockGeofence]);

      const result = await favoritesRepository.getFavorites(differentUsername);

      expect(result).toEqual([mockGeofence]);
      expect(mockGetFavoritesForUserApi).toHaveBeenCalledWith(differentUsername);
    });
  });

  describe('addFavorite', () => {
    it('should add favorite successfully', async () => {
      const updatedList = [...mockFavoritesList, mockGeofence];
      mockAddFavoriteApi.mockResolvedValue(updatedList);

      const result = await favoritesRepository.addFavorite(mockUsername, mockGeofence);

      expect(result).toEqual(updatedList);
      expect(mockAddFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
      expect(mockAddFavoriteApi).toHaveBeenCalledTimes(1);
    });

    it('should handle adding duplicate favorite', async () => {
      // La API maneja duplicados retornando la lista actual sin cambios
      mockAddFavoriteApi.mockResolvedValue(mockFavoritesList);

      const result = await favoritesRepository.addFavorite(mockUsername, mockGeofence);

      expect(result).toEqual(mockFavoritesList);
      expect(mockAddFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
    });

    it('should handle API errors in addFavorite', async () => {
      const apiError = new Error('Add Favorite API Error');
      mockAddFavoriteApi.mockRejectedValue(apiError);

      await expect(favoritesRepository.addFavorite(mockUsername, mockGeofence)).rejects.toThrow('Add Favorite API Error');
      expect(mockAddFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
    });

    it('should work with different geofences', async () => {
      const newGeofence: Geofence = {
        id: '3',
        name: 'New Geofence',
        latitude: 35.6762,
        longitude: 139.6503,
        radius: 300,
      };
      const updatedList = [...mockFavoritesList, newGeofence];
      mockAddFavoriteApi.mockResolvedValue(updatedList);

      const result = await favoritesRepository.addFavorite(mockUsername, newGeofence);

      expect(result).toEqual(updatedList);
      expect(mockAddFavoriteApi).toHaveBeenCalledWith(mockUsername, newGeofence);
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite successfully', async () => {
      const updatedList = mockFavoritesList.filter(g => g.id !== mockGeofence.id);
      mockRemoveFavoriteApi.mockResolvedValue(updatedList);

      const result = await favoritesRepository.removeFavorite(mockUsername, mockGeofence);

      expect(result).toEqual(updatedList);
      expect(mockRemoveFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
      expect(mockRemoveFavoriteApi).toHaveBeenCalledTimes(1);
    });

    it('should handle removing non-existent favorite', async () => {
      const nonExistentGeofence: Geofence = {
        id: '999',
        name: 'Non-existent',
        latitude: 0,
        longitude: 0,
        radius: 100,
      };
      // La API retorna la lista sin cambios si el favorito no existe
      mockRemoveFavoriteApi.mockResolvedValue(mockFavoritesList);

      const result = await favoritesRepository.removeFavorite(mockUsername, nonExistentGeofence);

      expect(result).toEqual(mockFavoritesList);
      expect(mockRemoveFavoriteApi).toHaveBeenCalledWith(mockUsername, nonExistentGeofence);
    });

    it('should handle API errors in removeFavorite', async () => {
      const apiError = new Error('Remove Favorite API Error');
      mockRemoveFavoriteApi.mockRejectedValue(apiError);

      await expect(favoritesRepository.removeFavorite(mockUsername, mockGeofence)).rejects.toThrow('Remove Favorite API Error');
      expect(mockRemoveFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
    });

    it('should return empty array when removing last favorite', async () => {
      mockRemoveFavoriteApi.mockResolvedValue([]);

      const result = await favoritesRepository.removeFavorite(mockUsername, mockGeofence);

      expect(result).toEqual([]);
      expect(mockRemoveFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
    });
  });

  describe('integration scenarios', () => {
    it('should maintain consistent interface with IFavoritesRepository', async () => {
      // Verificar que el repositorio implementa correctamente la interfaz
      expect(typeof favoritesRepository.getFavorites).toBe('function');
      expect(typeof favoritesRepository.addFavorite).toBe('function');
      expect(typeof favoritesRepository.removeFavorite).toBe('function');
    });

    it('should handle sequential operations correctly', async () => {
      // Simular una secuencia de operaciones
      mockGetFavoritesForUserApi.mockResolvedValue([]);
      mockAddFavoriteApi.mockResolvedValue([mockGeofence]);
      mockRemoveFavoriteApi.mockResolvedValue([]);

      // Obtener favoritos (vacío)
      const initialFavorites = await favoritesRepository.getFavorites(mockUsername);
      expect(initialFavorites).toEqual([]);

      // Agregar favorito
      const afterAdd = await favoritesRepository.addFavorite(mockUsername, mockGeofence);
      expect(afterAdd).toEqual([mockGeofence]);

      // Remover favorito
      const afterRemove = await favoritesRepository.removeFavorite(mockUsername, mockGeofence);
      expect(afterRemove).toEqual([]);

      // Verificar que todas las APIs fueron llamadas
      expect(mockGetFavoritesForUserApi).toHaveBeenCalledTimes(1);
      expect(mockAddFavoriteApi).toHaveBeenCalledTimes(1);
      expect(mockRemoveFavoriteApi).toHaveBeenCalledTimes(1);
    });

    it('should pass parameters correctly to API layer', async () => {
      mockGetFavoritesForUserApi.mockResolvedValue([]);
      mockAddFavoriteApi.mockResolvedValue([mockGeofence]);
      mockRemoveFavoriteApi.mockResolvedValue([]);

      await favoritesRepository.getFavorites(mockUsername);
      await favoritesRepository.addFavorite(mockUsername, mockGeofence);
      await favoritesRepository.removeFavorite(mockUsername, mockGeofence);

      // Verificar parámetros exactos
      expect(mockGetFavoritesForUserApi).toHaveBeenCalledWith(mockUsername);
      expect(mockAddFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
      expect(mockRemoveFavoriteApi).toHaveBeenCalledWith(mockUsername, mockGeofence);
    });
  });
});
