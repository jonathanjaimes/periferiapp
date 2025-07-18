import * as auth from '../auth';

describe('auth storage cobertura', () => {
  it('ejecuta funciones principales', async () => {
    await auth.saveUser('usuario');
    await auth.getUser();
    await auth.removeUser();
  });
});
