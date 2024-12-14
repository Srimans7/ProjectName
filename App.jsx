import 'react-native-gesture-handler';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './page1';
import LobbyScreen from './LobbyScreen';
import RequestScreen from './RequestPage';
import SecondScreen from './page3';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { Provider } from 'react-redux';
import { Store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import api from './axiosService';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform, PermissionsAndroid
} from 'react-native';

const Stack = createStackNavigator();

const requestAndroidNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (!hasPermission) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('POST_NOTIFICATIONS permission granted');
        return true;
      } else {
        console.log('POST_NOTIFICATIONS permission denied');
        return false;
      }
    }
  }
  return true; // For Android < 33, return true as permission is not required
};

const saveFcmToken = async () => {
  const token = await messaging().getToken();
  await api.post('/token', { token })
  .then(response => {
    console.log('Token update response:', response.data);
  })
  .catch(error => {
    console.error('Error updating token:', error.response?.data || error.message);
  });

  // Save the token (e.g., send it to your server or save in AsyncStorage)
  await AsyncStorage.setItem('fcmToken', token);
 
};



// Custom Sidebar Component
const Sidebar = ({ navigation, toggleSidebar, onLogout }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      onLogout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={toggleSidebar}>
        <Text style={styles.closeButton}>✕</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Home'); }}>
        <Text style={styles.menuItem}>🏠 Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Lobby'); }}>
        <Text style={styles.menuItem}>🛋️ Lobby</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Request'); }}>
        <Text style={styles.menuItem}>📩 Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { toggleSidebar(); navigation.navigate('Second'); }}>
        <Text style={styles.menuItem}>👫 Friend's Task</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={[styles.menuItem, styles.menuItemActive]}>🚪 Log out</Text>
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



const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
  } else {
    Alert.alert('Permission Required', 'Please enable notifications to use this feature.');
  }
};

useEffect(() => {

 

  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    Alert.alert(
      remoteMessage.notification.title,
      remoteMessage.notification.body
    );
  });

  return unsubscribe;
}, []);

useEffect(() => {
  const initializeNotifications = async () => {
    try {
      // Request notification permission for Android 13+
      const androidPermission = await requestAndroidNotificationPermission();
      if (!androidPermission) return;

     
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  initializeNotifications();
}, []);

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
    requestNotificationPermission();
    saveFcmToken();

    // Listen for token refresh
    return messaging().onTokenRefresh((newToken) => {
      console.log('FCM Token Refreshed:', newToken);
      saveFcmToken();
    });
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
                    key={props.route?.key || 'Home'} // Add key to force re-render
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
                    key={props.route?.key || 'Lobby'} // Add key to force re-render
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
                    key={props.route?.key || 'Request'} // Add key to force re-render
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
                    key={props.route?.key || 'Second'} // Add key to force re-render
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
    width: Dimensions.get('window').width * 0.5, // Sidebar width (70% of screen width)
    backgroundColor: '#0090BC', // Primary blue color
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sidebar: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'right',
    marginBottom: 24,
  },
  menuItem: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0078A3', // Slightly darker blue for menu item background
    textAlign: 'center',
  },
  menuItemActive: {
    backgroundColor: '#005F7E', // Even darker blue for the active menu item
  },
  hamburgerButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 1100,
  },
  hamburgerText: {
    fontSize: 28,
    color: '#0090BC',
    fontWeight: '700',
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light background for content
  },
}); 