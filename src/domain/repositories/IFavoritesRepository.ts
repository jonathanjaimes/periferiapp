import { User } from '../models/User';

export interface IFavoritesRepository {
  getFavorites(username: string): Promise<User[]>;
  addFavorite(username: string, user: User): Promise<User[]>;
  removeFavorite(username: string, userId: number): Promise<User[]>;
}
