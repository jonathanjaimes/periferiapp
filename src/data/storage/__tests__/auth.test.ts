/// <reference types="jest" />

import * as auth from '../auth';

describe('auth storage', () => {
  it('debería exponer las funciones principales', () => {
    expect(typeof auth.saveUser).toBe('function');
    expect(typeof auth.getUser).toBe('function');
    expect(typeof auth.removeUser).toBe('function');
  });
});
