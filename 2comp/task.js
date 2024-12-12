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
      <View style={styles.refreshContainer}>
        <TouchableOpacity onPress={fetchTasks}>
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 7,
    backgroundColor: '#F8F9FA',
  },
  refreshContainer: {
    alignSelf: 'center',
    backgroundColor: '#0090BC',
    padding: 12,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  refreshIcon: {
    width: 24,
    height: 24,
    tintColor: '#0090BC',
  },
  cardContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDetails: {
    flexDirection: 'column',
    width: '100%',
  },
  timeContainer: {
    borderRadius: 8,
    backgroundColor: '#0090BC',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  timeText: {
    color: '#FFDE66',
    fontWeight: '800',
    fontSize: 14,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFF88',
  },
  taskText: {
    color: '#009DCC',
    fontWeight: '600',
    fontSize: 18,
    flex: 1,
  },
  circle: {
    borderRadius: 16,
    borderColor: '#FFDE66',
    borderWidth: 3,
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
});

export default MyComponent;
