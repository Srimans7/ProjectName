import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from './axiosService';

export default function UserList() {
  const [data, setData] = useState([]); // State to hold user data
  const [loading, setLoading] = useState(true); // State to handle loading indicator

  // Function to handle sending friend request
  const sendFriendRequest = async (id) => {
    try {
      const response = await api.post(`http://10.0.2.2:3001/accept-request/${id}`);
      Alert.alert('Success', response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error sending friend request';
      Alert.alert('Error', errorMessage);
    }
  };

  async function handlePress(){
  
    let response = await api.post('http://10.0.2.2:3001/have-friend');
    const isFriend = response.data.state;
    if(!isFriend) Alert.alert("no friends");
    else await api.post('http://10.0.2.2:3001/remove-friend');
  }

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await api.get('http://10.0.2.2:3001/users-in-request');
        setData(response.data); // Save data to state
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.username}>Username: {item.username}</Text>
      <Text style={styles.email}>Email: {item.email}</Text>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => sendFriendRequest(item._id)} // Trigger the friend request API
      >
        <Text style={styles.buttonText}>Accept Friend Request</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id} // Use _id as a unique key
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.footer} onPress={handlePress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  list: {
    paddingHorizontal: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  requestButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  footer: {
    backgroundColor: "#AAE0F0",
    minHeight: 40,
    position: 'absolute',
    bottom: 0,
    width: "100%",
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
