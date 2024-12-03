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
  const [friend, setFriend] = useState(null); // State to hold friend details
  const [loading, setLoading] = useState(true); // State to handle loading indicator

  // Function to handle sending friend request
  const sendFriendRequest = async (id) => {
    try {
      const response = await api.post(`/send-request/${id}`);
      Alert.alert('Success', response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error sending friend request';
      Alert.alert('Error', errorMessage);
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
        setFriend(null); // Reset friend state
      }
    } catch (error) {
      Alert.alert("Error", "Could not process your request.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/users-without-friends');
        setData(response.data); // Save data to state
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        setLoading(false); // Hide loading indicator
      }

      try {
        const friendResponse = await api.get('/get-friend');
        setFriend(friendResponse.data);
      } catch (error) {
        console.log("No friend found:", error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.username}>👤 {item.username}</Text>
   
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => sendFriendRequest(item._id)} // Trigger the friend request API
      >
        <Text style={styles.buttonText}>Send Friend Request</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Find and Connect with Users</Text>
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
        <View style={styles.friendContainer}>
          <Text style={styles.subHeader}>Your Current Friend</Text>
          {friend ? (
            <> 
              <Text style={styles.friendText}>👤 {friend[0].username}</Text>
             
              <TouchableOpacity style={styles.removeButton} onPress={handlePress}>
                <Text style={styles.buttonText}>Remove Friend</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noFriendText}>You have no friends added.</Text>
          )}
        </View>
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
  friendContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#E8F8FF',
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#333",
  },
  friendText: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 5,
  },
  noFriendText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#FF6F61',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
});
