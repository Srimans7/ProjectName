import * as React from "react";
import {useState, useEffect} from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Button, Modal, Pressable, Image } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firebase from './firebase';
import Slider from '@react-native-community/slider';
import RNFS from 'react-native-fs';
import Sliders from './slider';
import Add from './add';
import { useSelector, useDispatch } from 'react-redux';
import { setDb } from '../redux/actions';


 function Card({ time, task }) {

   function uploader(){
    setShowUp(false);

  }



  const [showModal, setShowModal] = useState(false);
  const [showUp, setShowUp] = useState(true);
  const [myImage,showMyImage] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const handleCloseModal = () => setShowModal(false);
  const [imageUri, setImageUri] = useState([]);

 

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardDetails}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{time}</Text>
        </View>
        <View style={styles.taskContainer}>
          <Text style={styles.taskText}>{task}</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
          <View style={styles.circle} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        
        <Pressable style={styles.overlay} onPress={handleCloseModal}>
          <View style={styles.modalContainer}> 
          {imageUri[0] && <Sliders data = {sliderData}/>}
        <Add
          imageSource={require('../assets/x.png')}
          onPress={() => setShowModal(true)}
        />
        <Add
          imageSource={require('../assets/o.png')}
          onPress={() => setShowModal(true)}
        />
          </View>
        </Pressable>

      
      </Modal>
      
    </View>
  );
}

function MyComponent() {
  const dat = useSelector(state => state.userReducer);

  data= dat.db;
  data = data.filter(item => item.status != 'undone');

  return (
    <View style={styles.wrapper}>
      {data.map((item, index) => (
        <Card key={index} time={11} task={item.title} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7,
    width: "100%",
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "column",
    alignItems: "stretch",
  },
  cardContainer: {
    borderRadius: 10,
    boxShadow: "0px 4px 10px 2px rgba(0, 144, 188, 0.91)",
    backgroundColor: "#FFF",
    display: "flex",
    marginTop: 20,
    width: "100%",
    alignItems: "start",
    padding: "0 14px 13px",
  },
  cardDetails: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  timeContainer: {
    borderRadius: 8,
    backgroundColor: "rgba(0, 144, 188, 0.91)",
    width: 90,
    marginLeft: 15,
    alignItems: "center",
    color: "#FFDE66",
    justifyContent: "center",
    padding: "0px 7px",
    font: "800 14px Inter, sans-serif ",
    position: 'relative',
    top: -8,
  },
  timeText: {
    color: "#FFDE66",
    fontWeight: "800",
    fontSize: 14,
  },
  taskContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: "space-between",
    color: "#009DCC",
    marginTop: 0,
    font: "600 24px Inter, sans-serif ",
  },
  taskText: {
    color: "#009DCC",
    fontWeight: "600",
    fontSize: 24,
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
  circle: {
    borderRadius: 16,
    borderColor: "rgba(255, 222, 102, 1)",
    borderStyle: "solid",
    borderWidth: 5,
    backgroundColor: "#FFF",
    marginTop: 6,
    width: 32,
    height: 32,
    position: 'relative',
    top: -10,
  },
  
});

export default MyComponent;