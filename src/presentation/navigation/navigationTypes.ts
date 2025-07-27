import { NavigatorScreenParams } from '@react-navigation/native';

export type FeedStackParamList = {
  GeofenceList: undefined;
  GeofenceDetail: { geofenceId: string };
};

export type FavoritesStackParamList = {
  FavoritesScreen: undefined;
};

export type RootTabParamList = {
  Feed: NavigatorScreenParams<FeedStackParamList>;
  Favorites: NavigatorScreenParams<FavoritesStackParamList>;
  Profile: undefined;
  Location: undefined;
};

export type RootStackParamList = {
  BottomTab: NavigatorScreenParams<RootTabParamList>;
  Login: undefined;
};
