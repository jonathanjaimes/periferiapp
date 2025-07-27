import { IFavoritesRepository } from '../../domain/repositories';

import {
  getFavoritesForUserApi,
  addFavoriteApi,
  removeFavoriteApi,
} from '../api/favoritesApi';

export const favoritesRepository: IFavoritesRepository = {
  async getFavorites(username) {
    return getFavoritesForUserApi(username);
  },
  async addFavorite(username, geofence) {
    return addFavoriteApi(username, geofence);
  },
  async removeFavorite(username, geofence) {
    return removeFavoriteApi(username, geofence);
  },
};
