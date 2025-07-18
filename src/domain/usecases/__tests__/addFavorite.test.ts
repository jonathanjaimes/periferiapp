import { addFavorite } from '../addFavorite';

describe('addFavorite usecase', () => {
  it('debería ser una función', () => {
    expect(typeof addFavorite).toBe('function');
  });
});
