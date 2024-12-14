import React from 'react';
import {useState, useEffect} from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Button, Modal, Pressable } from 'react-native';
import Nav from './components/nav';
import Main from './2comp/main-card2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "./axiosService";



export default function HomeScreen({ navigation }) {
  const handlePress = () => {
    navigation.navigate('Home');
  };

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);



  const handleButtonClick = async () => {
    const token = await AsyncStorage.getItem('fcmToken');
    console.log("token ",token)
    try {
      const response = await api.post('/send-notification', {
        friendToken: token,
        title: 'Button Clicked!',
        body: 'Your friend clicked the button! kk',
      });
    } catch (error) {
      console.error('Error sending notification:', error); 
    }
  };

  const NotificationHandler = () => {
    
  };

  return (
    <View // Your local background image
      style={styles.backgroundImage}
   // Optional, if you need specific image styling
    >
      <View style={styles.container}>
        <Nav />
        
        <View style={styles.line} />

        <Text style={styles.heading}>Tasks yet to be verified</Text>
        <View style={styles.main}>
          <Main />

        </View>
        <TouchableOpacity onPress={handleButtonClick}>
  <Text>Notify Friend</Text>
  <NotificationHandler />
</TouchableOpacity>
        
        <TouchableOpacity style={styles.footer} onPress={handlePress}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    
    flex: 1,
    resizeMode: 'cover', // Or 'contain' if you prefer
    backgroundColor: 'white',
  },
  imageStyle: {
    top: '50%',// Additional image styling if needed
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure the background color is transparent to see the image
  },
  heading: {
    color: "#FFBD00",
    textShadowColor: "#A1D5E5",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    fontSize: 36,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
    alignSelf: 'center',
    marginTop: -4,
  },
  moneyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 0,
    padding: 0,
  },
  main: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  line: {
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "#0090BC",
    width: "90%",
    height: 0,  // Ensure this line is actually a line
    marginTop: 24,
    marginBottom: 18,
    alignSelf: 'center',
  },
  addButton: {
    overflow: "hidden",
    aspectRatio: 0.75,
    marginBottom: 100,
    width: "100%",
    paddingTop: 80,
    alignItems: "stretch",
  },
  footer: {
    backgroundColor: "#AAE0F0",
    minHeight: 40,
    position: 'absolute',
    bottom: 0,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent grey background
  },
  overlay: {
    flex: 1,
  },
});
