import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import UserSearchOverlay from '../components/UserSearchOverlay';
import { useUserList } from '../../hooks/useUserList';
import { useUserListLogic } from '../../hooks/useUserListLogic';
import { UserListItem } from '../../components/UserListItem';

const getAnimatedSearchBarStyle = (searchBarAnim: Animated.Value) => [
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
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 2,
  },
];

export default function UserListScreen() {
  const { users, isLoading, isError, error, navigation } = useUserList();
  const {
    query,
    setQuery,
    inputFocused,
    setInputFocused,
    inputRef,
    searchBarAnim,
    handleScroll,
    filteredUsers,
  } = useUserListLogic(users);

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
      <Animated.View style={getAnimatedSearchBarStyle(searchBarAnim)}>
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
        data={filteredUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            onPress={handleSelectUser}
            style={styles.itemContainer}
            favoriteIconStyle={styles.favoriteIcon}
          />
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
