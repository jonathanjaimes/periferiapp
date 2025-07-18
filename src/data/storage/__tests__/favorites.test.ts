/// <reference types="jest" />

import * as favorites from '../favorites';

describe('favorites storage', () => {
  it('debería exponer las funciones principales', () => {
    expect(typeof favorites.saveFavorites).toBe('function');
    expect(typeof favorites.getFavorites).toBe('function');
  });
});
