import { IFavoritesRepository } from '../../domain/repositories';

import { getFavoritesForUser, addFavoriteUseCase, removeFavoriteUseCase } from '../api/favoritesApi';

export const favoritesRepository: IFavoritesRepository = {
  async getFavorites(username) {
    return getFavoritesForUser(username);
  },
  async addFavorite(username, user) {
    return addFavoriteUseCase(username, user);
  },
  async removeFavorite(username, userId) {
    return removeFavoriteUseCase(username, userId);
  },
};
