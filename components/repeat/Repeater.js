import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import DayButton from "./DayButton";
import WeekdayButton from "./WeekdayButton";

function DaySelector() {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <View style={styles.container}>
      <View style={styles.selectorWrapper}>
        <View style={styles.everydayWrapper}>
          <View style={styles.everydayButton}>
            <Text>Everyday</Text>
          </View>
          <DayButton />
        </View>
        <View style={styles.weekdayWrapper}>
          <View style={styles.weekdayButtonsContainer}>
            <WeekdayButton label="Weekday" />
            <WeekdayButton label="Weekend" />
          </View>
          <View style={styles.dayButtonsContainer}>
            {weekdays.map((day, index) => (
              <DayButton key={index} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    maxWidth: 256,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
  },
  selectorWrapper: {
    borderRadius: 10,
    shadowColor: "rgba(0, 144, 188, 0.91)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderColor: "rgba(0, 157, 204, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#FFF",
    display: "flex",
    alignItems: "stretch",
    gap: 1,
    padding: 15,
  },
  everydayWrapper: {
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 10,
    color: "rgba(0, 144, 188, 0.91)",
    fontWeight: "500",
  },
  everydayButton: {
    fontFamily: "Inter, sans-serif",
    borderRadius: 5,
    shadowColor: "rgba(0, 144, 188, 0.91)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderColor: "rgba(0, 157, 204, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#CFEEF8",
    alignItems: "stretch",
    justifyContent: "center",
    padding: 4,
  },
  weekdayWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  weekdayButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 7,
    fontSize: 10,
    color: "rgba(0, 144, 188, 0.91)",
    fontWeight: "500",
  },
  dayButtonsContainer: {
    display: "flex",
    marginTop: 9,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 13,
  },
});

export default DaySelector;