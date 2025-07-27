import { useEffect, useRef } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootTabParamList } from '../navigation/AppNavigator';
import { useLogin } from '../../hooks/useLogin';

export function useProfileScreenLogic({tabName}: {tabName: string}) {
  const { user } = useLogin();
  const navigation = useNavigation<NativeStackNavigationProp<RootTabParamList>>();
  const prevUser = useRef(user);

  useEffect(() => {
    if (!prevUser.current && user) {
      navigation.dispatch(CommonActions.navigate({ name: tabName }));
    }
    prevUser.current = user;
  }, [user, navigation, tabName]);

  return {};
}
