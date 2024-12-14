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
  const [refreshKey, setRefreshKey] = useState(0); // State for refreshing the list

  // Function to handle accepting a friend request
  const acceptFriendRequest = async (id) => {
    try {
      const response = await api.post(`/accept-request/${id}`);
      Alert.alert('Success', response.data.message);
      setRefreshKey(refreshKey + 1); // Trigger a refresh after accepting a request
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error accepting friend request';
      Alert.alert('Error', errorMessage);
    }

    
    try {
     await api.post('/send-notification', {
       
        title: 'Friend Request',
        body: 'Your Friend Request got accepted',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  async function handlePress() {
    try {
      const response = await api.post('/have-friend');
      const isFriend = response.data.state;

      if (!isFriend) {
        Alert.alert("No Friends", "You currently don't have any friends added.");
      } else {
        await api.post('/remove-friend');
        Alert.alert("Success", "Friend removed successfully.");
        setRefreshKey(refreshKey + 1); // Trigger a refresh after removing a friend
      }
    } catch (error) {
      Alert.alert("Error", "Could not process your request.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users-in-request');
        setData(response.data); // Save data to state
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]); // Re-fetch data when refreshKey changes

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.username}>👤 {item.username}</Text>
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

        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={() => setRefreshKey(refreshKey + 1)} // Trigger refresh
        >
          <Text style={styles.refreshButtonText}>🔄 Refresh List</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#FFBD00" />
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
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    color: "#333",
    fontSize: 28,
    fontWeight: "700",
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    alignSelf: 'center',
    backgroundColor: '#0090BC',
    padding: 10,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: '#FFBD00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF6F61',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
