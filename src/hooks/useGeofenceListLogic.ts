import { useState, useRef } from 'react';
import { Animated, Easing, TextInput } from 'react-native';
import { Geofence } from '../domain/models/Geofence';

export function useGeofenceListLogic(geofences: Geofence[]) {
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Animación barra de búsqueda
  const searchBarAnim = useRef(new Animated.Value(1)).current;
  const lastOffset = useRef(0);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
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
      if (showSearchBar) setShowSearchBar(false);
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else if (offsetY < lastOffset.current - 8) {
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

  const filteredGeofences = !query.trim()
    ? geofences
    : geofences.filter((g: Geofence) => {
        const q = query.toLowerCase();
        return g.name.toLowerCase().includes(q);
      });

  return {
    query,
    setQuery,
    inputFocused,
    setInputFocused,
    inputRef,
    searchBarAnim,
    showSearchBar,
    setShowSearchBar,
    handleScroll,
    filteredGeofences,
  };
}
