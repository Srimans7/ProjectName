import React, { useState } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3001/register', {
        username,
        email,
        password,
      });

      if (response.data.success) {
        Alert.alert(
          "Registration successful",
          "You can now log in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Login'), // Navigate after alert dismissal
            }
          ]
        );
      } else {
        Alert.alert("Registration failed", response.data.message || "Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert("Registration error", "An error occurred during registration.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}
