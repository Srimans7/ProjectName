import * as React from "react";
import { View, StyleSheet } from "react-native";
import Task from './task';

function MyComponent() {
  return <View style={styles.cardContainer}>
       < Task />
  </View>;
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 10,
    backgroundBlendMode: "plus-darker",
    boxShadow: "0px 1px 10px 1px #009DCC",
    backgroundColor: "rgba(174, 225, 241, 0.40)",
    height: 400,
   // aspectRatio: 1,
  },
});

export default MyComponent;