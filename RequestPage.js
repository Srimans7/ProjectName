import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import api from './axiosService';

export default function UserList() {
  const [data, setData] = useState([]); // State to hold user data
  const [loading, setLoading] = useState(true); // State to handle loading indicator

  // Function to handle accepting a friend request
  const acceptFriendRequest = async (id) => {
    try {
      const response = await api.post(`http://10.0.2.2:3001/accept-request/${id}`);
      Alert.alert('Success', response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error accepting friend request';
      Alert.alert('Error', errorMessage);
    }
  };

  async function handlePress() {
    try {
      const response = await api.post('http://10.0.2.2:3001/have-friend');
      const isFriend = response.data.state;

      if (!isFriend) {
        Alert.alert("No Friends", "You currently don't have any friends added.");
      } else {
        await api.post('http://10.0.2.2:3001/remove-friend');
        Alert.alert("Success", "Friend removed successfully.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not process your request.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('http://10.0.2.2:3001/users-in-request');
        setData(response.data); // Save data to state
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.username}>👤 {item.username}</Text>
      <Text style={styles.email}>📧 {item.email}</Text>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => acceptFriendRequest(item._id)} // Trigger the accept friend request API
      >
        <Text style={styles.buttonText}>Accept Friend Request</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Manage Friend Requests</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0090BC" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id} // Use _id as a unique key
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
        <TouchableOpacity style={styles.removeButton} onPress={handlePress}>
          <Text style={styles.removeButtonText}>Remove Friend</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    color: "#FFBD00",
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0090BC',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  requestButton: {
    backgroundColor: '#0090BC',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF6F61',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: "60%",
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
