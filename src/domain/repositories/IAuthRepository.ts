export interface IAuthRepository {
  saveUser(username: string): Promise<void>;
  getUser(): Promise<string | null>;
  removeUser(): Promise<void>;
}
