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
import { setDb, setDb1, setTestFunction } from './redux/actions';
import Realm from "realm";
import Task from './components/model';
import { useRealm } from './RealmProvider';
import moment from 'moment';


import {scheduleNotification} from "./notify";



export default function HomeScreen({ navigation }) {
  const handlePress = () => {
    navigation.navigate('Second');
  };

  const [showModal, setShowModal] = useState(false);
 
  const [sum, setSum] = useState(0);

  const handleCloseModal = () => setShowModal(false);
  const { db} = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
   
   

const realm = useRealm();
const today = moment().startOf('day');

function convertUTCtoIST(utcDate) {
  // Create a new Date object from the UTC date string
  const date = new Date(utcDate);

  // Calculate IST offset from UTC: +5 hours and 30 minutes
  const offset = 5 * 60 + 30; // 5 hours * 60 minutes + 30 minutes

  // Apply the IST offset (in milliseconds)
  const istDate = new Date(date.getTime() - offset * 60 * 1000);

  return istDate;
}


function getCurrentDateInDDMMYY() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with 0 if needed
  const year = String(date.getFullYear()).slice(2); // Get the last two digits of the year
  return `${day}${month}${year}`;
}

function extractDateFromStatus(status) {
  // Extract the date part which starts after "today-"
  const dateString = status.substring(6); // Get substring starting from index 6
  const day = dateString.substring(0, 2);
  const month = dateString.substring(2, 4);
  const year = dateString.substring(4, 6);
  
  // Create a date object using the extracted parts
  const date = new Date(`20${year}-${month}-${day}`); // Prepend '20' to year to make it 4 digits
  return date;
}


const reTasks = () => {
  const today = moment().startOf('day');

  if (!realm) return { sum: 0, tasks: [] };

  const tasks = realm.objects('Task');
  const tasko = realm.objects('Task1');
  const prevSum = realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon;
  let localSum = prevSum;

  realm.write(() => {
      tasks.forEach(task => {
          const taskDate = moment(task.date);
          const isRepeatable = task.week && task.week.length > 0;
          const currentDayOfWeek = moment().format('ddd');
          const isScheduledToday = task.status.startsWith('today-') && extractDateFromStatus(task.status).getTime() === today.toDate().getTime();

          // Ensure repeatable tasks are updated for today and scheduled only once
          if (isRepeatable && task.week.includes(currentDayOfWeek) && !isScheduledToday) {
              if (task.status === 'active') {
                  task.status = `today-${getCurrentDateInDDMMYY()}`;
                  scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));
              } else if (task.status === 'undone') {
                  localSum += task.mon;
                  task.status = `today-${getCurrentDateInDDMMYY()}`;
                  scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));
              }
              // Removed condition to change "done" tasks to "today" again on the same day
          }

          // Handle task status changes
          if (task.status === 'ver') {
              if (isRepeatable) {
                  task.status = 'active';
              } else {
                  realm.delete(task);
              }
          } else if (taskDate.isBefore(today)) {
              if (task.status === 'today' || task.status === 'undone') {
                  localSum += task.mon;
                  if (isRepeatable) {
                      task.status = 'active';
                  } else {
                      realm.delete(task);
                  }
              }
          } else if (taskDate.isSame(today, 'day')) {
              if (task.status === 'undone' && !isScheduledToday) {
                  task.status = 'today';
                  scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));
              } else if (task.status === 'inactive') {
                  task.status = 'active';
              }
          }

          // Update the 'mon' value in the task with the specified primary key
          realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon = localSum;
      });
  });

 
  dispatch(setDb(tasks));


};


useEffect(() => reTasks, [ showModal]);





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
          <Money mn = {sum}/> 
        </View>
        <View style={styles.line} />
        <Text style={styles.heading} >Task Today</Text>
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
