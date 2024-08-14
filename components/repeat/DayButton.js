import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

function DayButton({label, selected, onPress}) {
  return <TouchableOpacity
  onPress={onPress}
><View style={[styles.dayButton, selected && styles.selectedDayButton]} /></TouchableOpacity>;
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
  selectedDayButton: {
    backgroundColor: '#d3d3d3',
  },
});

export default DayButton;