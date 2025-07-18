/// <reference types="jest" />

import * as authStore from '../authStore';

describe('authStore', () => {
  it('debería importar sin errores', () => {
    expect(authStore).toBeDefined();
  });
});
