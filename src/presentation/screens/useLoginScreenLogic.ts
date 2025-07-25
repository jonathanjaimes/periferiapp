import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useLogin } from '../../hooks/useLogin';
import { useAuthStore } from '../../store/authStore';

export function useLoginScreenLogic() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();
  const setError = useAuthStore((state) => state.setError);

  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setPassword('');
      setError(null);
    }, [setError])
  );

  const onSubmit = async () => {
    setError(null);
    await login(username, password);
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    onSubmit,
  };
}
