import { fetchUsersApi, fetchUserApi } from '../api/usersApi';
import { IUserRepository } from '../../domain/repositories';
import { User } from '../../domain/models/User';

// Adaptador para transformar un usuario de la API al modelo de dominio
function mapApiUserToDomain(user: any): User {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
  };
}

export const userRepository: IUserRepository = {
  async getUsers() {
    const apiUsers = await fetchUsersApi();
    return apiUsers.map(mapApiUserToDomain);
  },
  async getUserById(id) {
    const apiUser = await fetchUserApi(id);
    return apiUser ? mapApiUserToDomain(apiUser) : null;
  },
};
