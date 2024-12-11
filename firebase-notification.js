import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveFcmToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);

  // Save the token (e.g., send it to your server or save in AsyncStorage)
  await AsyncStorage.setItem('fcmToken', token);
};

useEffect(() => {
  saveFcmToken();

  // Listen for token refresh
  return messaging().onTokenRefresh((newToken) => {
    console.log('FCM Token Refreshed:', newToken);
    saveFcmToken();
  });
}, []);
