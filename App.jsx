import 'react-native-gesture-handler'; // Ensure this line is at the top
import * as React from 'react';
import {useState} from 'react';
import { Text, View, Button,  Modal, Pressable, StyleSheet  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './page1';
import AddTask from './components/addTask';

function SettingsScreen({ navigation }) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent grey background
    },
    overlay: {
      flex: 1,
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <Button title="Open Add Task" onPress={() => setShowModal(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.overlay} onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <AddTask />
          </View>
        </Pressable>
      </Modal>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
         screenOptions={{
          headerShown: false, // Hide header globally
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
