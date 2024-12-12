import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  Button 
} from 'react-native';
import api from './axiosService';

export default function UserList() {
  const [data, setData] = useState([]);
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

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
        setFriend(null);
      }
    } catch (error) {
      Alert.alert("Error", "Could not process your request.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users-without-friends');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert("Error", "Could not fetch user data.");
      } finally {
        setLoading(false);
      }

      try {
        const friendResponse = await api.get('/get-friend');
        setFriend(friendResponse.data);
      } catch (error) {
        console.log("No friend found:", error);
      }
    };

    fetchData();
  }, [refreshKey]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.username}>👤 {item.username}</Text>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => sendFriendRequest(item._id)}
      >
        <Text style={styles.buttonText}>Send Friend Request</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>🤝 Find and Connect</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={() => setRefreshKey(refreshKey + 1)}
        >
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#FFBD00" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
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
                <Text style={styles.removeButtonText}>Remove Friend</Text>
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
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    alignSelf: 'center',
    backgroundColor: '#0090BC',
    padding: 12,
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
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
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  requestButton: {
    marginTop: 10,
    backgroundColor: '#FFBD00',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  friendContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  friendText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  noFriendText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#FF6F61',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
