import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import UserSearchOverlay from '../components/UserSearchOverlay';
import { useUserList } from '../../hooks/useUserList';

export default function UserListScreen() {
  const { users, isLoading, isError, error, navigation } = useUserList();

  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = React.useRef<TextInput>(null);

  // Animación barra de búsqueda
  const searchBarAnim = useRef(new Animated.Value(1)).current; // 1: visible, 0: oculto
  const lastOffset = useRef(0);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      // Siempre mostrar en el tope
      if (!showSearchBar) setShowSearchBar(true);
      Animated.timing(searchBarAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
      lastOffset.current = offsetY;
      return;
    }
    if (offsetY > lastOffset.current + 8 && !inputFocused) {
      // Scroll arriba: ocultar
      if (showSearchBar) setShowSearchBar(false);
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else if (offsetY < lastOffset.current - 8) {
      // Scroll abajo: mostrar
      if (!showSearchBar) setShowSearchBar(true);
      Animated.timing(searchBarAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }
    lastOffset.current = offsetY;
  };

  const filteredUsers = !query.trim()
    ? users
    : users.filter((u: any) => {
        const q = query.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      });

  const handleSelectUser = (user: { id: number }) => {
    navigation.navigate('UserDetail', { userId: user.id });
    setTimeout(() => {
      setInputFocused(false);
      setQuery('');
      inputRef.current?.blur();
    }, 100);
  };

  // Lógica de loading/error después de los hooks
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando usuarios...</Text>
      </View>
    );
  }

  if (isError && error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error: {error instanceof Error ? error.message : String(error)}
        </Text>
      </View>
    );
  }

  // Return principal
  return (
    <View style={styles.mainContainer}>
      {/* Buscador animado absoluto */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: searchBarAnim,
            transform: [
              {
                translateY: searchBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-76, 0], // Altura total barra
                }),
              },
            ],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            elevation: 2,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={text => setQuery(text)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          selectionColor="#222"
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />
        {query.trim().length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setQuery('');
              setInputFocused(false);
              inputRef.current?.blur();
            }}
            accessibilityLabel="Limpiar búsqueda"
          >
            <Icon
              name="close-circle"
              size={22}
              color="#888"
              style={styles.iconMarginLeft}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setInputFocused(true)}>
            <Icon
              name="search"
              size={22}
              color="#888"
              style={styles.iconMarginLeft}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Overlay de sugerencias */}
      {inputFocused && query.trim().length > 0 && (
        <UserSearchOverlay
          results={filteredUsers}
          onSelect={handleSelectUser}
          onClose={() => setInputFocused(false)}
          query={query}
        />
      )}

      {/* Lista de usuarios */}
      <FlatList
        contentContainerStyle={{ paddingTop: 86 }}
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              navigation.navigate('UserDetail', { userId: item.id })
            }
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.username}>@{item.username}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  favoriteIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  iconMarginLeft: {
    marginLeft: 8,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 36,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#cd3422',
    marginBottom: 2,
  },
  username: {
    color: '#888',
    marginBottom: 2,
  },
  email: {
    color: '#cd3422',
  },
});
