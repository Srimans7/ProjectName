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



import moment from 'moment';

import api from './axiosService';

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

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await api.get('http://10.0.2.2:3001/tasks');  // Replace with your API URL
      const tasks = response.data;
      console.log ("TASKS  : ", tasks)
      let localSum = 0;

     // const prevSumResponse = await api.get('http://10.0.2.2:3001/task/1724230688403-kv2er3pcj');
     /* const prevSumResponse = tasks.find((task) => task._id === "1724230688403-kv2er3pcj");
      let prevSum = prevSumResponse.mon;  // Assuming the API returns a `mon` field
      localSum = prevSum; */

      const today = new Date();

      // Helper functions for date comparison
      const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
      };

      const isBeforeDay = (date1, date2) => {
        return date1.getMonth() <= date2.getMonth() &&
               date1.getDate() < date2.getDate();
      };

      // Iterate through tasks and update statuses
      tasks.forEach(async (task) => {
        const taskDate = moment(task.date);
        const isRepeatable = task.week && task.week.length > 0;
        const currentDayOfWeek = moment().format('ddd');
        const isScheduledToday = task.status.startsWith('today-') &&
          extractDateFromStatus(task.status).getTime() === today.getTime();

        console.log(`Processing task: ${task.title}, date: ${taskDate.toString()}`);
        console.log(`Repeatable: ${isRepeatable}, Status: ${task.status}`);

        if (isRepeatable && task.week.includes(currentDayOfWeek) && 
            !(task.status === `today-${getCurrentDateInDDMMYY()}` || task.status === `done-${getCurrentDateInDDMMYY()}`)) {
          if (task.status !== 'active') {
         //  localSum += task.mon;
          }
          task.status = `today-${getCurrentDateInDDMMYY()}`;  // Update status locally

          // Schedule a notification (replace with actual notification code)
          scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));

          // Update the task status in the database
          await api.put(`http://10.0.2.2:3001/task/${task._id}`, { status: task.status });
        } else if (task.status === 'ver') {
          if (isRepeatable) {
            task.status = 'active';
          } else {
            // Delete the task via API
            await api.delete(`http://10.0.2.2:3001/task/${task._id}`);
          }
        } else if (isBeforeDay(taskDate.toDate(), today)) {
          
          if (task.status.startsWith('today') || task.status === 'undone') {
          //  localSum += task.mon;
            console.log("lose : " , task.mon, task.title)
            if (isRepeatable) {
              task.status = 'active';
            } else {
              // Delete the task via API
              
              try{ await api.delete(`http://10.0.2.2:3001/task/${task._id}`);
            }
              catch(e) {console.log("not deleted ", e)}
            }
          }
        } else if (isSameDay(taskDate.toDate(), today)) { 
       
          if (task.status === 'undone') {
            task.status = `today-${getCurrentDateInDDMMYY()}`;
          }
          if (task.status === 'inactive') {
            task.status = 'active';
          }
          // Update the task status in the database
          await api.put(`http://10.0.2.2:3001/task/${task._id}`, { status: task.status });
        }

      });

      // Update the sum of 'mon' for the task with the specific ID
    /*  await api.put(`http://10.0.2.2:3001/task/1724230688403-kv2er3pcj`, {
        mon: localSum
      }); 
      setSum(localSum);
*/
      // Dispatch the tasks to the store
      dispatch(setDb(tasks));
    } catch (error) {
      console.error('Error fetching or updating tasks:', error);
    }
  };

  // Call the fetchTasks function
  fetchTasks();
}, [dispatch, showModal]);




  return (
    <View 
    
    style={styles.backgroundImage}
   
  >
      <View style={styles.container}>
        <Nav />
        <View style={styles.moneyContainer}>
          <Money mn = {sum}/> 
        </View>
       <View style={styles.line} />
        <Text style={styles.heading} >Complete Your Task</Text>
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
    top: '50%',
    opacity: 0.1
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure the background color is transparent to see the image
  },
  heading: {
    color: "#FFBD00",
    textShadowColor: "lightorange",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    fontSize: 34,
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
