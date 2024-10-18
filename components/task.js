import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, Button, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import Sliders from './slider';
import { useSelector, useDispatch } from 'react-redux';
import { setDb } from '../redux/actions';
import Add from '../2comp/add';

function MyComponent() {
  const data = useSelector(state => state.userReducer.db); // Fetch from Redux
  const dispatch = useDispatch();

  // Fetch tasks from the server API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://ec2-54-221-130-21.compute-1.amazonaws.com:5000/tasks');
        dispatch(setDb(response.data)); // Store fetched tasks in Redux
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

  function Card({ time, task, id, status }) {
    const [showModal, setShowModal] = useState(false);
    const [imageUri, setImageUri] = useState([]);
    const [img, setImg] = useState(['https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg']);

    useEffect(() => {
      // Find the task from the Redux store using its ID
      const currentTask = data.find((task) => task._id === id);
      if (currentTask && currentTask.img) {
        setImg(currentTask.img); // Set images from the task
      }
    }, [id, data]);

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
        const updatedImages = [...img, newImageURL]; // Add the new image URL to the existing images
        const response = await axios.put(`http://ec2-54-221-130-21.compute-1.amazonaws.com:5000/task/${documentId}`, {
          img: updatedImages,
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
      try {
        await axios.put(`http://ec2-54-221-130-21.compute-1.amazonaws.com:5000/task/${documentId}`, {
          status: `done-${getCurrentDateInDDMMYY()}`,
        });
        setShowModal(false);

        // Fetch updated tasks
        const updatedTasks = await axios.get('http://ec2-54-221-130-21.compute-1.amazonaws.com:5000/tasks');
        dispatch(setDb(updatedTasks.data));
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
              <Button title="Open Camera" onPress={openCamera} />
            </View>
          </Pressable>
          {sliderData.length > 0 && <Sliders data={sliderData} />}
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
            item.status &&   item.status.startsWith('today') && (
              <Card key={index} time={formatTime(item.date)} task={item.title} id={item._id} status={item.status} />
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
