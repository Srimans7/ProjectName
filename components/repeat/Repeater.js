import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import DayButton from "./DayButton";
import WeekdayButton from "./WeekdayButton";

function DaySelector({sendData}) {
  const [selectedDays, setSelectedDays] = React.useState([]);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  React.useEffect(() => {
 sendData(selectedDays);
}, [selectedDays]);
  const handleDayPress = (day) => {
    setSelectedDays(prevState => {
      if (prevState.includes(day)) {
        // Remove day if already selected
        return prevState.filter(d => d !== day);
      } else {
        // Add day if not selected
        return [...prevState, day];
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorWrapper}>
        
        
        <View style={styles.weekdayWrapper}>
          
          <View style={styles.weekdayButtonsContainer}>
          <View style={styles.everydayWrapper}>
          <View style={styles.everydayButton}>
            <Text>Everyday</Text>
          </View>
        </View>
            <WeekdayButton label="Weekday" />
            <WeekdayButton label="Weekend" />
          </View>
          <View style={styles.dayButtonsContainer}>
            {weekdays.map((day, index) => (
              <DayButton      key={index}
              label={day}
              onPress={() => handleDayPress(day)}
              selected={selectedDays.includes(day)} />
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
    padding: 15,
  },
  everydayWrapper: {
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "column",
    fontSize: 10,
    color: "rgba(0, 144, 188, 0.91)",
    fontWeight: "500",
  },
  everydayButton: {
    borderRadius: 5,
    shadowColor: "rgba(0, 144, 188, 0.91)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderColor: "rgba(0, 157, 204, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#CFEEF8",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  weekdayButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 7,
    fontSize: 10,
    color: "rgba(0, 144, 188, 0.91)",
    fontWeight: "500",
  },
  dayButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",  // Allow buttons to wrap if necessary
    justifyContent: "space-between",  // Spread out buttons evenly
    marginTop: 9,
    gap: 5,  // Decrease gap between buttons
  },
});


export default DaySelector;