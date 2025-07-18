/// <reference types="jest" />

import * as userStore from '../userStore';

describe('userStore', () => {
  it('debería importar sin errores', () => {
    expect(userStore).toBeDefined();
  });
});
