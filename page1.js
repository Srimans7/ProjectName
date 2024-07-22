import React from 'react';
import {useState} from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Button, Modal, Pressable } from 'react-native';
import Money from './components/metrics/money';
import Nav from './components/nav';
import Main from './components/main-card';
import Add from './components/add';
import Cir from './components/metrics/cir';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddTask from './components/addTask';

export default function HomeScreen({ navigation }) {
  const handlePress = () => {
    navigation.navigate('Settings');
  };

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  return (
    <ImageBackground 
      source={require('./assets/bg.png')} // Your local background image
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle} // Optional, if you need specific image styling
    >
      <View style={styles.container}>
        <Nav />
        <View style={styles.moneyContainer}>
          <Cir />
          <Money /> 
        </View>
        <View style={styles.line} />
        <Text style={styles.heading}>Task Today</Text>
        <View style={styles.main}>
          <Main />
        </View>
        <Add
          imageSource={require('./assets/Add.png')}
          onPress={() => setShowModal(true)}
        />
              
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.overlay} onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <AddTask />
          </View>
        </Pressable>
      </Modal>
        <TouchableOpacity style={styles.footer} onPress={handlePress}/>
      </View>
    </ImageBackground>
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
    borderColor: "rgba(0, 144, 188, 1)",
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
