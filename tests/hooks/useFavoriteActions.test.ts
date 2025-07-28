import { renderHook, act } from '@testing-library/react-native';
import { useFavoriteActions } from '../../src/hooks/useFavoriteActions';

// Mock de los stores
const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();
const mockFavorites: any[] = [];
let mockUser: string | null = 'admin'; // Usuario es solo el username

jest.mock('../../src/store/favoritesStore', () => ({
  useFavoritesStore: (selector: any) => {
    const store = {
      favorites: mockFavorites,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
    };
    return selector(store);
  },
}));

jest.mock('../../src/store/authStore', () => ({
  useAuthStore: (selector: any) => {
    const store = {
      user: mockUser,
    };
    return selector(store);
  },
}));

describe('useFavoriteActions', () => {
  const mockGeofence = {
    id: '1',
    name: 'Test Geofence',
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFavorites.length = 0; // Limpiar array
    mockUser = 'admin'; // Restaurar usuario autenticado
  });

  it('should return correct initial state', () => {
    const { result } = renderHook(() => useFavoriteActions());
    
    expect(result.current.authUser).toEqual(mockUser);
    expect(typeof result.current.isFavorite).toBe('function');
    expect(typeof result.current.handleFavorite).toBe('function');
  });

  it('should add favorite when geofence is not favorite', async () => {
    const { result } = renderHook(() => useFavoriteActions());
    
    await act(async () => {
      await result.current.handleFavorite(mockGeofence);
    });
    
    expect(mockAddFavorite).toHaveBeenCalledWith(mockUser, mockGeofence);
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  it('should remove favorite when geofence is already favorite', async () => {
    // Simular que el geofence ya es favorito
    mockFavorites.push(mockGeofence);
    
    const { result } = renderHook(() => useFavoriteActions());
    
    await act(async () => {
      await result.current.handleFavorite(mockGeofence);
    });
    
    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockUser, mockGeofence);
    expect(mockAddFavorite).not.toHaveBeenCalled();
  });

  it('should detect if geofence is favorite', () => {
    const { result } = renderHook(() => useFavoriteActions());
    
    // Inicialmente no es favorito
    expect(result.current.isFavorite(mockGeofence.id)).toBe(false);
    
    // Agregar a favoritos
    mockFavorites.push(mockGeofence);
    
    // Re-renderizar hook
    const { result: newResult } = renderHook(() => useFavoriteActions());
    expect(newResult.current.isFavorite(mockGeofence.id)).toBe(true);
  });

  it('should not handle favorite when user is not authenticated', async () => {
    // Simular usuario no autenticado
    mockUser = null;
    
    const { result } = renderHook(() => useFavoriteActions());
    
    await act(async () => {
      await result.current.handleFavorite(mockGeofence);
    });
    
    expect(mockAddFavorite).not.toHaveBeenCalled();
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  it('should return false for non-existent geofence', () => {
    const { result } = renderHook(() => useFavoriteActions());
    
    expect(result.current.isFavorite('non-existent-id')).toBe(false);
  });

  it('should handle multiple favorites correctly', () => {
    const anotherGeofence = {
      id: '2',
      name: 'Another Geofence',
      latitude: 41.8781,
      longitude: -87.6298,
      radius: 150,
    };
    
    mockFavorites.push(mockGeofence, anotherGeofence);
    
    const { result } = renderHook(() => useFavoriteActions());
    
    expect(result.current.isFavorite(mockGeofence.id)).toBe(true);
    expect(result.current.isFavorite(anotherGeofence.id)).toBe(true);
    expect(result.current.isFavorite('3')).toBe(false);
  });
});
