import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Image 
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import api from '../axiosService';
import storage from '@react-native-firebase/storage';
import Sliders from './slider';
import { useSelector, useDispatch } from 'react-redux';
import { setDb1 } from '../redux/actions';
import Add from '../2comp/add';

function MyComponent() {
  const data = useSelector(state => state.userReducer.db1);
  const dispatch = useDispatch();

  // Fetch tasks from the server API
  const fetchTasks = async () => {
    try {
      const response = await api.get('/partner-task');
      dispatch(setDb1(response.data));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [dispatch]);

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

    useEffect(() => {
      setImg(images || []);
    }, [images]);

    const openCamera = () => {
      launchCamera({ mediaType: 'photo' }, (response) => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets[0].uri;
          setImageUri((prevUris) => [...prevUris, uri]);
        }
      });
    };

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
        const response = await api.put(`/task/${documentId}`, {
          img: [...img, newImageURL],
        });
        setImg(response.data.img);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

    const sliderData = img.map((uri, index) => ({
      key: index,
      imageUrl: uri,
    }));

    const completeTask = async (documentId) => {
      try {
        await api.delete(`/partner-task/${documentId}`);
        setShowModal(false);
        fetchTasks();
      } catch (error) {
        console.error('Error completing task:', error);
      }
    };

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
          <Add imageSource={require('../assets/o.png')} onPress={() => completeTask(id)} />
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Refresh Button */}
      
      
      <ScrollView>
        {data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((item, index) => (
            item.status.startsWith('done') && (
              <Card
                key={index}
                time={formatTime(item.date)}
                task={item.title}
                id={item._id}
                status={item.status}
                images={item.img}
              />
            )
          ))}
      </ScrollView>
      
        <TouchableOpacity onPress={fetchTasks}>
        <View style={styles.refreshContainer}>
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </View>
        </TouchableOpacity>
     
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
  circle: {
    borderRadius: 16,
    borderColor: '#FFDE66',
    borderWidth: 5,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    flex: 1,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshContainer: {
    alignSelf: 'center',
    backgroundColor: '#0090BC',
    padding: 12,
    borderRadius: 25,
    marginBottom: 20,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  refreshIcon: {
    width: 24,
    height: 24,
    tintColor: '#0090BC',
  },
});

export default MyComponent;
