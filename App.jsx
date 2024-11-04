import 'react-native-gesture-handler'; // Ensure this line is at the top
import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './page1';
import SecondScreen from './page2';
import LoginScreen from './LoginScreen'; // Import the login screen
import { Provider } from 'react-redux';
import { Store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import RegisterScreen from './RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isLoggedIn ? "Home" : "Login"} // Conditionally set initial route
            screenOptions={{
              headerShown: false, // Hide header globally
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animationTypeForReplace: isLoggedIn ? 'pop' : 'push',
              }}
            />
             <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Second" component={SecondScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
