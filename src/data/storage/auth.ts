import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';

export const saveUser = async (username: string): Promise<void> => {
  await AsyncStorage.setItem(USER_KEY, username);
};

export const getUser = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(USER_KEY);
};

export const removeUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_KEY);
};
