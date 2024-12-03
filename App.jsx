import 'react-native-gesture-handler';
import * as React from 'react';
import { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
const Sidebar = ({ navigation, toggleSidebar, onLogout }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Clear token from storage
      onLogout(); // Update the `isLoggedIn` state
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
        <Text style={styles.menuItem}>Friend's Task</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.menuItem}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

// Wrapper Component for Screens with Sidebar
const ScreenWithSidebar = ({ children, navigation, onLogout }) => {
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
        <Sidebar navigation={navigation} toggleSidebar={toggleSidebar} onLogout={onLogout} />
      </Animated.View>
      <View style={styles.screenContent}>{children}</View>
    </View>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [loading, setLoading] = useState(true); // Track loading state for token check

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to fetch token", error);
      } finally {
        setLoading(false); // Set loading to false after token check
      }
    };
    checkLoginStatus();
  }, []);

  const onLogout = () => {
    setIsLoggedIn(false); // Update state to reflect logged-out status
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Public Screens */}
          {!isLoggedIn && (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
  
          {/* Private Screens */}
          {true && (
            <>
              <Stack.Screen name="Home">
                {(props) => (
                  <ScreenWithSidebar
                    navigation={props.navigation}
                    onLogout={onLogout}
                    key={props.route?.key || 'Home'} // Add `key` to force re-render
                  >
                    <HomeScreen {...props} />
                  </ScreenWithSidebar>
                )}
              </Stack.Screen>
              <Stack.Screen name="Lobby">
                {(props) => (
                  <ScreenWithSidebar
                    navigation={props.navigation}
                    onLogout={onLogout}
                    key={props.route?.key || 'Lobby'} // Add `key` to force re-render
                  >
                    <LobbyScreen {...props} />
                  </ScreenWithSidebar>
                )}
              </Stack.Screen>
              <Stack.Screen name="Request">
                {(props) => (
                  <ScreenWithSidebar
                    navigation={props.navigation}
                    onLogout={onLogout}
                    key={props.route?.key || 'Request'} // Add `key` to force re-render
                  >
                    <RequestScreen {...props} />
                  </ScreenWithSidebar>
                )}
              </Stack.Screen>
              <Stack.Screen name="Second">
                {(props) => (
                  <ScreenWithSidebar
                    navigation={props.navigation}
                    onLogout={onLogout}
                    key={props.route?.key || 'Second'} // Add `key` to force re-render
                  >
                    <SecondScreen {...props} />
                  </ScreenWithSidebar>
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PersistGate>
  </Provider>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('window').width * 0.4, // Sidebar width (70% of screen width)
    backgroundColor: '#0090BC', // Primary blue color
    zIndex: 1000,
    elevation: 5,
  },
  sidebar: {
    flex: 1,
    paddingVertical: 16, // Equivalent to spacing.medium
    paddingHorizontal: 16,
  },
  closeButton: {
    fontSize: 18,
    color: '#FFFFFF', // White text
    textAlign: 'right',
    marginBottom: 24, // Equivalent to spacing.large
  },
  menuItem: {
    color: '#FFFFFF', // White text
    fontSize: 16, // Body font size
    fontWeight: '400', // Regular font weight
    marginVertical: 8, // Equivalent to spacing.small
    paddingHorizontal: 8,
  },
  hamburgerButton: {
    position: 'absolute',
    top: 24, // Equivalent to spacing.large
    left: 16, // Equivalent to spacing.medium
    zIndex: 1100,
  },
  hamburgerText: {
    fontSize: 24,
    color: '#0090BC', // Primary blue color
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    padding: 16, // Equivalent to spacing.medium
  },
});


