import { create } from 'zustand';
import type { User } from '../domain/models/User';

interface UserStoreState {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
