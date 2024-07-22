import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { Easing, useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const CircularGraph = ({ progress }) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - (circumference * animatedProgress.value) / 100,
    };
  });

  return ( 
    <View style={styles.container}>
      <Svg height="150" width="150" viewBox="0 0 150 150">
        <Circle
          cx="75"
          cy="75"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx="75"
          cy="75"
          r={radius}
          stroke="#3b5998"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * progress) / 100}
          fill="none"
        />
      </Svg>
      <Text style={styles.percentage}>{`${Math.round(progress)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  percentage: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b5998',
  },
});

export default CircularGraph;
