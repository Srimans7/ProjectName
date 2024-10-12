import 'react-native-gesture-handler/jestSetup';

// Mocks
jest.mock('react-native-gesture-handler', () => {
  const GestureHandler = jest.requireActual('react-native-gesture-handler');

  return {
    ...GestureHandler,
    // Mock components if necessary
    // For example, if you're using Swipeable or other components from the library
    //Swipeable: (props) => <View>{props.children}</View>,
    // Add more mocks as necessary
  };
});