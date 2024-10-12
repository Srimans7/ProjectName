import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

function WeekdayButton({ label }) {
  return (
    <View style={styles.weekdayButton}>
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  weekdayButton: {
    fontFamily: "Inter, sans-serif",
    borderRadius: 5,
    shadowColor: "rgba(0, 144, 188, 0.91)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderColor: "rgba(0, 157, 204, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#FFF",
    alignItems: "stretch",
    justifyContent: "center",
    padding: 5,
  },
});

export default WeekdayButton;