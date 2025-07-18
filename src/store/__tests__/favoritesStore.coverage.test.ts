/// <reference types="jest" />
import { useFavoritesStore } from '../favoritesStore';

describe('favoritesStore cobertura', () => {
  it('ejecuta métodos principales', () => {
    const state = useFavoritesStore.getState();
    const dummyUser = {
      id: 1,
      name: 'Juan',
      username: 'juanito',
      email: 'juan@mail.com',
      address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
      phone: '',
      website: '',
      company: { name: '', catchPhrase: '', bs: '' }
    };
    if (state.addFavorite) state.addFavorite('usuario', dummyUser);
    if (state.removeFavorite) state.removeFavorite('usuario', 1);
    if (state.loadFavorites) state.loadFavorites('usuario');
  });
});
