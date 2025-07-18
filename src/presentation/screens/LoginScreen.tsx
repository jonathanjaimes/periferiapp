import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { useLoginScreenLogic } from '../../hooks/useLoginScreenLogic';

export default function LoginScreen() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    onSubmit,
  } = useLoginScreenLogic();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario (ej: admin)"
        placeholderTextColor="#888"
        autoCapitalize="none"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={[styles.input, { color: '#222' }]}
        placeholder="Contraseña (ej: 1234)"
        placeholderTextColor="#888"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <CustomButton
        title={loading ? 'Cargando...' : 'Iniciar sesión'}
        onPress={onSubmit}
        style={styles.button}
        textStyle={styles.buttonText}
        disabled={loading}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#cd3422" />
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 54,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#cd3422',
    minWidth: 180,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    // fontFamily: undefined, // No personalizar fuente para evitar errores visuales en secureTextEntry
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
