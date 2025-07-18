module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons)/)"
  ],
  preset: 'react-native',
  moduleNameMapper: {
    "^react-native-vector-icons/Ionicons$": "<rootDir>/__mocks__/react-native-vector-icons.js",
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
    '^@react-navigation/native$': '<rootDir>/__mocks__/reactNavigationNativeMock.js',
    '^@react-navigation/native-stack$': '<rootDir>/__mocks__/reactNavigationNativeStackMock.js',
  },
};
