import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import api from './axiosService';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await api.post('/register', {
        username,
        email,
        password,
      });

      if (response.data.success) {
        Alert.alert(
          "Registration Successful",
          "You can now log in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Login'), // Navigate after alert dismissal
            }
          ]
        );
      } else {
        Alert.alert("Registration Successful", "You can now log in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Login'), // Navigate after alert dismissal
            }
          ]);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert("Registration Error", "An error occurred during registration.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Account</Text>
      <Text style={styles.subHeader}>Join us and start your journey!</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#AAA"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#AAA"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#AAA"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFBD00',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#0090BC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#333',
    backgroundColor: '#F5F5F5',
  },
  registerButton: {
    backgroundColor: '#0090BC',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 10,
  },
  loginText: {
    color: '#0090BC',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
