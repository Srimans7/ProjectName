import React, { useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet, useWindowDimensions, FlatList, Text } from 'react-native';

const data = [
  { key: '1', imageUrl: require('../assets/add.png') },
  { key: '2', imageUrl: require('../assets/bg.png') },
];

const Slider = ({data}) => {
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { width }]}>
      <Image
        source={{uri : item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
        onError={(error) => console.log('Image Load Error:', error)}
      />
    </View>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      },
    }
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        bounces={false}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View key={index} style={[styles.indicator, { transform: [{ scale }] }]} />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 600, // Adjust height to make it more prominent
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd', // Optional: Add a border for better visibility
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#595959',
    margin: 10,
  },
});

export default Slider;
