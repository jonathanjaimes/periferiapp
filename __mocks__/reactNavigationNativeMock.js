module.exports = {
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({ dispatch: jest.fn(), navigate: jest.fn() }),
  useFocusEffect: jest.fn(),
  CommonActions: { navigate: jest.fn() },
};
