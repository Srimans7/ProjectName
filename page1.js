import React from 'react';
import {useState, useEffect} from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Button, Modal, Pressable } from 'react-native';
import Money from './components/metrics/money';
import Nav from './components/nav';
import Main from './components/main-card';
import Add from './components/add';
import Cir from './components/metrics/cir';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddTask from './components/addTask';
import { useSelector, useDispatch } from 'react-redux';
import { setDb } from './redux/actions';
import Realm from "realm";
import Task from './components/model';
import { useRealm } from './RealmProvider';
import moment from 'moment';

export default function HomeScreen({ navigation }) {
  const handlePress = () => {
    navigation.navigate('Second');
  };

  const [showModal, setShowModal] = useState(false);
 
  const [sum, setSum] = useState(0);

  const handleCloseModal = () => setShowModal(false);
  const { db} = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    console.log(1+db);
   

const realm = useRealm();
const today = moment().startOf('day');

useEffect(() => {
  if (realm) {
    const tasks = realm.objects('Task');
    const prevSum = realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon;
    let localSum = prevSum;
    realm.write(() => {
      
    tasks.forEach(task => {
      const taskDate = moment(task.date);
      if(task.status == 'ver') realm.delete(task);
      if (taskDate.isBefore(today)) {
        if(task.status == 'today' || task.status == 'undone' ){
        localSum += task.mon;
        realm.delete(task);}
        console.log(`Deleted task`);
      } else if (taskDate.isSame(today, 'day')) {
        if(task.status == 'undone') task.status = 'today';
      }

      realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon = localSum;
    }) });
    setSum(localSum);
    dispatch(setDb(tasks)); // task today undone present done 
    // done comp(delete)
    //unver || undone present 
    console.log("#######   ",tasks);
  }
}, [realm, dispatch]);

const {testFunction} = useSelector(state => state.userReducer);
const handl = () => {
  if (testFunction) {
    testFunction('435435','435435435');
  }
};


  return (
    <ImageBackground 
      source={require('./assets/bg.png')} // Your local background image
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle} // Optional, if you need specific image styling
    >
      <View style={styles.container}>
        <Nav />
        <View style={styles.moneyContainer}>
          <Cir onPress = {handl}/>
          <Money mn = {sum}/> 
        </View>
        <View style={styles.line} />
        <Text style={styles.heading}>Task Today</Text>
        <View style={styles.main}>
          <Main />
        </View>
        <Add
          imageSource={require('./assets/add.png')}
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
