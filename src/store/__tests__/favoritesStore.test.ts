/// <reference types="jest" />

import * as favoritesStore from '../favoritesStore';

describe('favoritesStore', () => {
  it('debería importar sin errores', () => {
    expect(favoritesStore).toBeDefined();
  });
});
