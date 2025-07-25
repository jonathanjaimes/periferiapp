import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useProfile } from '../../hooks/useProfile';
import { useProfileScreenLogic } from './useProfileScreenLogic';

export default function ProfileScreen() {
  const { user, logout } = useProfile();

  useProfileScreenLogic({ tabName: 'Feed' });

  if (!user) {
    const LoginScreen = require('./LoginScreen').default;
    return <LoginScreen />;
  }

  return (
    <View style={styles.centered}>
      <Icon
        name="person-circle"
        size={96}
        color="#cd3422"
        style={styles.icon}
      />
      <Text style={styles.title}>{user}</Text>
      <CustomButton
        title="Cerrar sesión"
        onPress={logout}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fff',
    minWidth: 180,
    borderColor: '#cd3422',
    borderWidth: 1,
  },
  buttonText: {
    color: '#cd3422',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
