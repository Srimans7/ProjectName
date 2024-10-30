import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, Button, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import Sliders from './slider';
import { useSelector, useDispatch } from 'react-redux';
import { setDb1 } from '../redux/actions';
import Add from '../2comp/add';

function MyComponent() {
  const data = useSelector(state => state.userReducer.db1); // Fetch from Redux
  const dispatch = useDispatch();

  // Fetch tasks from the server API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://ec2-50-19-179-98.compute-1.amazonaws.com:3000/tasks');
        dispatch(setDb1(response.data)); // Store fetched tasks in Redux
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  // Format the time
  const formatTime = (isoDateString) => {
    const date = new Date(isoDateString);
    let hours = date.getUTCHours() % 12 || 12;
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours.toString().padStart(2, '0')}:${minutes} ${date.getUTCHours() >= 12 ? 'PM' : 'AM'}`;
  };

  function Card({ time, task, id, status, images }) {
    const [showModal, setShowModal] = useState(false);
    const [imageUri, setImageUri] = useState([]);
    const [img, setImg] = useState([]);

    // Fetch task images from the API
    useEffect(() => {
      const fetchTask = async () => {
        try {
         
          setImg(images);
        } catch (error) {
          console.error('Error fetching task imags:', error);
        }
      };

      fetchTask();
    }, [id]);

    const openCamera = () => {
      launchCamera({ mediaType: 'photo' }, (response) => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets[0].uri;
          setImageUri((prevUris) => [...prevUris, uri]);
        }
      });
    };

    // Upload the image to Firebase and update the task via the API
    const uploadImage = async () => {
      if (imageUri.length === 0) return;

      const uri = imageUri[imageUri.length - 1];
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`images/${filename}`);

      try {
        await storageRef.putFile(uri);
        const downloadURL = await storageRef.getDownloadURL();
        updateTask(id, downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload Failed', 'Failed to upload image');
      }
    };

    const updateTask = async (documentId, newImageURL) => {
      try {
        const response = await axios.put(`http://ec2-50-19-179-98.compute-1.amazonaws.com:3000/task/${documentId}`, {
          img: [...img, newImageURL], // Add the new image URL to the existing images
        });
        setImg(response.data.img); // Update the state with the updated task images
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

    const sliderData = img.map((uri, index) => ({
      key: index,
      imageUrl: uri,
    }));

    const compTask = async (documentId) => {
      console.log("Deleted");
      try {
         await axios.delete(`http://ec2-50-19-179-98.compute-1.amazonaws.com:3000/task/${documentId}`);
        setShowModal(false);

        // Fetch updated tasks
        const updatedTasks = await axios.get('http://ec2-50-19-179-98.compute-1.amazonaws.com:3000/tasks');
        dispatch(setDb1(updatedTasks.data));
      } catch (error) {
        console.error('Error completing task:', error);
      }
    };

    function getCurrentDateInDDMMYY() {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(2);
      return `${day}${month}${year}`;
    }

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardDetails}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View style={status.startsWith('unver') ? styles.taskContainer2 : styles.taskContainer}>
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
          onRequestClose={() => setShowModal(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setShowModal(false)}>
            <View style={styles.modalContainer}>
            {sliderData.length > 0 && <Sliders data={sliderData} />}
            </View>
          </Pressable>
         
          <Add imageSource={require('../assets/o.png')} onPress={() => compTask(id)} />
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        {data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((item, index) => (
            item.status.startsWith('done') && (
              <Card key={index} time={formatTime(item.date)} task={item.title} id={item._id} status={item.status} images={item.img} />
            )
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
