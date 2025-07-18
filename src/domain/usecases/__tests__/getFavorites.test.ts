import { getFavoritesForUser } from '../getFavorites';

describe('getFavoritesForUser usecase', () => {
  it('debería ser una función', () => {
    expect(typeof getFavoritesForUser).toBe('function');
  });
});
