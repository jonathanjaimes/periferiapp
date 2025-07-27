import { create } from 'zustand';
import type { Geofence } from '../domain/models/Geofence';
import { getGeofences } from '../domain/usecases';

interface GeofenceStoreState {
  geofences: Geofence[];
  addGeofence: (geofence: Geofence) => void;
  removeGeofence: (id: string) => void;
  loadGeofencesFromStorage: () => Promise<void>;
}

export const useGeofenceStore = create<GeofenceStoreState>((set) => ({
  geofences: [],
  addGeofence: (geofence) =>
    set((state) => ({ geofences: [...state.geofences, geofence] })),
  removeGeofence: (id) =>
    set((state) => ({
      geofences: state.geofences.filter((g) => g.id !== Number(id)),
    })),
    loadGeofencesFromStorage: async () => {
      const geofences = await getGeofences();
      set({ geofences });
    },
}));