import 'react-native-gesture-handler'; // Ensure this line is at the top
import * as React from 'react';
import {useState} from 'react';
import { Text, View, Button,  Modal, Pressable, StyleSheet  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './page1';
import SecondScreen from './page2';
import AddTask from './components/addTask';
import { Provider } from 'react-redux';
import { Store, persistor } from './redux/store';

import PushNotification from "react-native-push-notification";
import  { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTestFunction } from './redux/actions';
import { PersistGate } from 'redux-persist/integration/react';



const Stack = createStackNavigator();

export default function App() {


 
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
   
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
         screenOptions={{
          headerShown: false, // Hide header globally
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          
        />
        <Stack.Screen
          name="Second"
          component={SecondScreen}
          options={{ title: 'Second' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  
    </PersistGate>
    </Provider>
  );
}
