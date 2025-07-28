import { addFavorite } from '../../../src/domain/usecases/addFavorite';
import { Geofence } from '../../../src/domain/models/Geofence';
import { favoritesRepository } from '../../../src/data/repositories/favoritesRepository';

// Mock del repositorio
jest.mock('../../../src/data/repositories/favoritesRepository', () => ({
  favoritesRepository: {
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavorites: jest.fn(),
  },
}));

const mockFavoritesRepository = favoritesRepository as jest.Mocked<typeof favoritesRepository>;

describe('addFavorite', () => {
  const mockUsername = 'testuser@example.com';
  const mockGeofence: Geofence = {
    id: '1',
    name: 'Test Geofence',
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 100,
  };

  const mockUpdatedFavorites: Geofence[] = [
    mockGeofence,
    {
      id: '2',
      name: 'Existing Favorite',
      latitude: 41.0000,
      longitude: -75.0000,
      radius: 200,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add favorite successfully', async () => {
    mockFavoritesRepository.addFavorite.mockResolvedValue(mockUpdatedFavorites);

    const result = await addFavorite(mockUsername, mockGeofence);

    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      mockUsername,
      mockGeofence
    );
    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUpdatedFavorites);
  });

  it('should handle repository errors', async () => {
    const repositoryError = new Error('Repository error');
    mockFavoritesRepository.addFavorite.mockRejectedValue(repositoryError);

    await expect(addFavorite(mockUsername, mockGeofence)).rejects.toThrow(
      'Repository error'
    );

    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      mockUsername,
      mockGeofence
    );
    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledTimes(1);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network request failed');
    mockFavoritesRepository.addFavorite.mockRejectedValue(networkError);

    await expect(addFavorite(mockUsername, mockGeofence)).rejects.toThrow(
      'Network request failed'
    );

    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      mockUsername,
      mockGeofence
    );
  });

  it('should pass correct parameters to repository', async () => {
    mockFavoritesRepository.addFavorite.mockResolvedValue([]);

    await addFavorite(mockUsername, mockGeofence);

    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      mockUsername,
      mockGeofence
    );

    // Verificar que los parámetros son exactamente los esperados
    const [calledUsername, calledGeofence] = mockFavoritesRepository.addFavorite.mock.calls[0];
    expect(calledUsername).toBe(mockUsername);
    expect(calledGeofence).toEqual(mockGeofence);
  });

  it('should work with different usernames', async () => {
    const differentUsername = 'anotheruser@example.com';
    mockFavoritesRepository.addFavorite.mockResolvedValue([mockGeofence]);

    const result = await addFavorite(differentUsername, mockGeofence);

    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      differentUsername,
      mockGeofence
    );
    expect(result).toEqual([mockGeofence]);
  });

  it('should work with different geofence data', async () => {
    const differentGeofence: Geofence = {
      id: '999',
      name: 'Different Location',
      latitude: 51.5074,
      longitude: -0.1278,
      radius: 500,
    };
    mockFavoritesRepository.addFavorite.mockResolvedValue([differentGeofence]);

    const result = await addFavorite(mockUsername, differentGeofence);

    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      mockUsername,
      differentGeofence
    );
    expect(result).toEqual([differentGeofence]);
  });

  it('should handle empty response from repository', async () => {
    mockFavoritesRepository.addFavorite.mockResolvedValue([]);

    const result = await addFavorite(mockUsername, mockGeofence);

    expect(result).toEqual([]);
    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      mockUsername,
      mockGeofence
    );
  });

  it('should handle repository returning undefined', async () => {
    mockFavoritesRepository.addFavorite.mockResolvedValue(undefined as any);

    const result = await addFavorite(mockUsername, mockGeofence);

    expect(result).toBeUndefined();
    expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
      mockUsername,
      mockGeofence
    );
  });

  it('should maintain geofence object integrity', async () => {
    const originalGeofence = { ...mockGeofence };
    mockFavoritesRepository.addFavorite.mockResolvedValue([mockGeofence]);

    await addFavorite(mockUsername, mockGeofence);

    // Verificar que el objeto geofence no fue modificado
    expect(mockGeofence).toEqual(originalGeofence);
  });

  it('should handle async operation correctly', async () => {
    // Simular una operación asíncrona que toma tiempo
    mockFavoritesRepository.addFavorite.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([mockGeofence]), 100))
    );

    const startTime = Date.now();
    const result = await addFavorite(mockUsername, mockGeofence);
    const endTime = Date.now();

    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    expect(result).toEqual([mockGeofence]);
  });
});
