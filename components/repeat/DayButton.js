import * as React from "react";
import { View, StyleSheet } from "react-native";

function DayButton() {
  return <View style={styles.dayButton} />;
}

const styles = StyleSheet.create({
  dayButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 157, 204, 1)",
    borderStyle: "solid",
    backgroundColor: "#FFF",
    borderRadius: 50,
    alignSelf: "flex-end",
    marginTop: 9,
    width: 18,
    height: 16,
  },
});

export default DayButton;