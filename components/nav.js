import * as React from "react";
import { FlatList, ScrollView, View, StyleSheet, Image, Text } from "react-native";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Image resizeMode="auto" source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/3c655248e4e6ba5e5096c0eefa82ecce30d76e3e5e247c6aeff81bf5cfec0095?apiKey=2a38c587787c4f68bb9ff72712a54e47&" }} style={styles.image} />
      <View style={styles.textWrapper}>
        <Text>Paritto</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    boxShadow: "0px 1px 10px 1px rgba(0, 144, 188, 0.91)",
    backgroundColor: "rgba(3, 162, 210, 0.32)",
    display: "flex",
    flexDirection: 'row',
    alignItems: "stretch",
    gap: 19,
    fontSize: 24,
    color: "rgba(3, 162, 210, 0.91)",
    fontWeight: "500",
    whiteSpace: "nowrap",
    padding: "0 80px",
    height: '33px',
  },
  image: {
    position: "relative",
    width: 39,
    flexShrink: 0,
    aspectRatio: "1.18",
  },
  textWrapper: {
    fontFamily: "Inter, sans-serif",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    margin: "auto 0",
  },
});