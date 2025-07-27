import { useState, useCallback, useEffect } from 'react';
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootTabParamList } from '../presentation/navigation/AppNavigator';
import { useLogin } from './useLogin';
import { useAuthStore } from '../store/authStore';

export function useLoginScreenLogic() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, user } = useLogin();
  const navigation = useNavigation<NativeStackNavigationProp<RootTabParamList>>();
  const setError = useAuthStore((state) => state.setError);

  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setPassword('');
      setError(null);
    }, [setError])
  );

  useEffect(() => {
    if (user) {
      navigation.dispatch(CommonActions.navigate({ name: 'Feed' }));
    }
  }, [user, navigation]);

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
