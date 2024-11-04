// LoginScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const handleLogin = () => {
    // Simulate login action; navigate to the main app
    navigation.replace("Home"); // Replace Login with Home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LoginScreen;
