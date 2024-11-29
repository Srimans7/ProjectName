import 'react-native-gesture-handler';
import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './page1';
import LobbyScreen from './LobbyScreen';
import RequestScreen from './RequestPage';
import SecondScreen from './page2';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { Provider } from 'react-redux';
import { Store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const Stack = createStackNavigator();

// Custom Sidebar Component
const Sidebar = ({ navigation, toggleSidebar }) => {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={toggleSidebar}>
        <Text style={styles.closeButton}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Home'); }}>
        <Text style={styles.menuItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Lobby'); }}>
        <Text style={styles.menuItem}>Lobby</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Request'); }}>
        <Text style={styles.menuItem}>Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Second'); }}>
        <Text style={styles.menuItem}>Second Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

// Wrapper Component for Screens with Sidebar
const ScreenWithSidebar = ({ children, navigation }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-Dimensions.get('window').width * 0.7)); // Sidebar starts hidden

  const toggleSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: isSidebarVisible ? -Dimensions.get('window').width * 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsSidebarVisible(!isSidebarVisible));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.hamburgerButton} onPress={toggleSidebar}>
        <Text style={styles.hamburgerText}>☰</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.sidebarOverlay, { left: sidebarAnimation }]}>
        <Sidebar navigation={navigation} toggleSidebar={toggleSidebar} />
      </Animated.View>
      <View style={styles.screenContent}>{children}</View>
    </View>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isLoggedIn ? "Home" : "Login"}
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Public Screens */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />

            {/* Private Screens */}
            <Stack.Screen name="Home">
              {(props) => (
                <ScreenWithSidebar navigation={props.navigation}>
                  <HomeScreen {...props} />
                </ScreenWithSidebar>
              )}
            </Stack.Screen>
            <Stack.Screen name="Lobby">
              {(props) => (
                <ScreenWithSidebar navigation={props.navigation}>
                  <LobbyScreen {...props} />
                </ScreenWithSidebar>
              )}
            </Stack.Screen>
            <Stack.Screen name="Request">
              {(props) => (
                <ScreenWithSidebar navigation={props.navigation}>
                  <RequestScreen {...props} />
                </ScreenWithSidebar>
              )}
            </Stack.Screen>
            <Stack.Screen name="Second">
              {(props) => (
                <ScreenWithSidebar navigation={props.navigation}>
                  <SecondScreen {...props} />
                </ScreenWithSidebar>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('window').width * 0.3, // Sidebar width (70% of screen width)
    backgroundColor: '#007bff',
    zIndex: 1000,
    elevation: 5,
  },
  sidebar: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  closeButton: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'right',
    marginBottom: 20,
  },
  menuItem: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  hamburgerButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1100,
  },
  hamburgerText: {
    fontSize: 24,
    color: '#007bff',
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
});
