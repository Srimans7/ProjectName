import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CustomImageButton = ({ imageSource, onPress }) => {
  const touchableSize = 45;

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={{
          ...styles.touchableArea,
          width: touchableSize,
          height: touchableSize,
          borderRadius: touchableSize / 2,
        }}
        onPress={onPress}
      ><Image source={imageSource} style={styles.image} /></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    left: '12%'
  },
  image: {
    resizeMode: 'cover',
  },
  touchableArea: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -50 }, { translateY: -50 }], // Adjust to center
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent for visibility during development
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomImageButton;
