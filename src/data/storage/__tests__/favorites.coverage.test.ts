import * as favorites from '../favorites';
import { User } from '../../../domain/models/User';

describe('favorites storage cobertura', () => {
  it('ejecuta funciones principales', async () => {
    const user: User = {
      id: 1,
      name: 'Juan',
      username: 'juanito',
      email: 'juan@mail.com',
      address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
      phone: '',
      website: '',
      company: { name: '', catchPhrase: '', bs: '' }
    };
    await favorites.saveFavorites('usuario', [user]);
    await favorites.getFavorites('usuario');
  });
});
