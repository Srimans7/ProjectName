import firebase from '@react-native-firebase/app';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDKTGaKu3IEOckAARVEbUilIrd4W7WawN4",
  authDomain: `apps-6cde5.firebaseapp.com`,
  projectId: "apps-6cde5",
  storageBucket: "apps-6cde5.appspot.com",
  messagingSenderId: "579341334740",
  appId: "1:579341334740:android:ed0228454d8c4da3a0a341",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
