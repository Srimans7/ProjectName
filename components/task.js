import * as React from "react";
import {useState, useEffect} from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Button, Modal, Pressable, Image } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import Sliders from './slider';
import { useSelector, useDispatch } from 'react-redux';
import { setDb } from '../redux/actions';
import Task from './model';
import { useRealm } from '../RealmProvider'; 
import Add from '../2comp/add';
import { ScrollView } from "react-native-gesture-handler";



function MyComponent() {
  const dat = useSelector(state => state.userReducer);

  data= dat.db;
  
  const formatTime = (isoDateString) => {
    const date = new Date(isoDateString);
    let hours = date.getUTCHours() % 12 || 12;
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours.toString().padStart(2, '0')}:${minutes} ${date.getUTCHours() >= 12 ? 'PM' : 'AM'}`;
  };

  const dispatch = useDispatch();
  const realm = useRealm(); 
 
  useEffect(() => { async () => {
    if (realm) {
      const tasks = realm.objects(Task);
   
      dispatch(setDb(tasks));
    } else{
  
    }
}}, [realm, dispatch]);



  function Card({ time, task, id, status }) {

    function uploader(){
     setShowUp(false);
 
   }
 
 
 
   const [showModal, setShowModal] = useState(false);
   const [showUp, setShowUp] = useState(true);
   const [myImage,showMyImage] = useState(null);
   const [percentage, setPercentage] = useState(0);
   const handleCloseModal = () => setShowModal(false);
   const [imageUri, setImageUri] = useState([]);
   const { db} = useSelector(state => state.userReducer);
   const [images,setImages] = useState();
   const [img,setImg] = useState(['https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg']);
   const [p,sp] = useState();

  useEffect(() => {
  
    if (realm && realm.objectForPrimaryKey(Task, id) && realm.objectForPrimaryKey(Task, id).img[0]) {
     
      setImg(realm.objectForPrimaryKey(Task, id).img)
    }
  }, [realm, dispatch]);

  useEffect(() => {
    
      uploadImage();
    
  }, [realm, dispatch, imageUri]);

 
 
   const openCamera = () => {
     launchCamera({ mediaType: 'photo' }, (response) => {
       if (response.didCancel) {

       } else if (response.errorCode) {
         console.log('ImagePicker Error: ', response.errorMessage);
       } else {
        setImageUri((prevUris) => [...prevUris, response.assets[0].uri]);
      
        
       }
     });
   };
 
   const openImageLibrary = () => {
     launchImageLibrary({ mediaType: 'photo' }, (response) => {
       if (response.didCancel) {

       } else if (response.errorCode) {
         console.log('ImagePicker Error: ', response.errorMessage);
       } else {
         setImageUri(response.assets[0].uri);
       }
     });
   };
 
 
 
 
   const uploadImage = async () => {
    // Check if imageUri array is empty
    if (imageUri.length === 0) return;
  
    // Get the last element in the imageUri array
    const ur = imageUri[imageUri.length - 1];
    const filename = ur.substring(ur.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${filename}`);
  
    try {
      await storageRef.putFile(ur);
      const downloadURL = await storageRef.getDownloadURL();
      updateTask(id, downloadURL);

    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Upload Failed', 'Failed to upload image');
    }
  };
  
 
 
 
   const sliderData = img[0] && img.map((uri, index) => ({
     key: index,
     imageUrl: uri,
   }));


   const updateTask = async (documentId, newValue) => {
    if (realm) {
      try {
        const taskToUpdate = realm.objectForPrimaryKey(Task, documentId); // Assuming 'Task1' is the model name and _id is the primary key

        if (taskToUpdate) {
          realm.write(() => {
            taskToUpdate.img.push(newValue); // Replace 'someProperty' with the actual property to update
          });
          setImg([...taskToUpdate.img]);
        } else {
          console.log('Task not found');
        }
      } catch (err) {
        console.error('Error updating task', err);
      }
    }
  };


  const compTask = async (documentId) => {
    if (realm) {
      try {
        const taskToUpdate = realm.objectForPrimaryKey(Task, documentId); 
  
        if (taskToUpdate) {
          realm.write(() => {

            setShowModal(false);
            taskToUpdate.status = 'done';
            const taskst = realm.objects(Task); 
    dispatch(setDb(taskst));
             // Replace 'someProperty' with the actual property to update
          });
  
          const updatedTasks = realm.objects(Task);
            dispatch(setDb([...updatedTasks]));
          
        } else {
          console.log('Task not found');
        }
      } catch (err) {
        console.error('Error updating task', err);
      }
    }
  };

 
   return (
     <View style={styles.cardContainer}>
       <View style={styles.cardDetails}>
         <View style={styles.timeContainer}>
           <Text style={styles.timeText}>{time}</Text>
         </View>
         <View style={(status == 'unver') ? styles.taskContainer2 : ((status == 'over') ? styles.taskContainer3 : styles.taskContainer) }>
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
           <Button title="Open Camera" onPress={openCamera} />
           { // <Button title="Open Image Library" onPress={openImageLibrary} />
           }
           </View>
         </Pressable>
 
         {<Sliders data = {sliderData}/>}
       
        <Add
          imageSource={require('../assets/o.png')}
          onPress={() => compTask(id)}
        />
       </Modal>
       
     </View>
   );
 }
  return (
    <View style={styles.wrapper}>
      <ScrollView>
      {   [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).map((item, index) => (
        (item.status === 'today' || item.status.substring(0, 5) === 'today' ) && 
        <Card key={index} time={formatTime(item.date)} task={item.title} id={item._id} status = {item.status} />
        
      ))}
      </ScrollView>
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
  taskContainer2: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: "space-between",
    color: "#009DCC",
    backgroundColor: '#FFFF00',
    marginTop: 0,
    font: "600 24px Inter, sans-serif ",
  },
  taskContainer3: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    flexDirection: 'row',
    justifyContent: "space-between",
    color: "#009DCC",
    backgroundColor: '#FF8488',
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