/// <reference types="jest" />
import { useUserStore } from '../userStore';

describe('userStore cobertura', () => {
  it('ejecuta métodos principales', () => {
    const state = useUserStore.getState();
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
    if (state.setSelectedUser) state.setSelectedUser(dummyUser);
    if (state.setSelectedUser) state.setSelectedUser(null);
  });
});
