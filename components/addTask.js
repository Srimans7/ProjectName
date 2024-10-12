import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Switch, Image, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import Slider from "@react-native-community/slider";
import Realm from "realm";
import Task from './model';
import { useRealm } from '../RealmProvider';
import { useDispatch } from 'react-redux';
import { setDb } from '../redux/actions';
import { scheduleNotification } from '../notify';

export default function AddTask() {
  const [date, setDate] = useState(new Date());
  const [dur, setDur] = useState(5);
  const [mon, setMon] = useState(10);
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(prev => !prev);

  const dispatch = useDispatch();

  const mapValueToNonLinearScale = (value) => {
    const maxSliderValue = 300;
    const scaleFactor = 2;
    const adjustedValue = 10 + Math.pow(value / maxSliderValue, scaleFactor) * maxSliderValue;
    return Math.floor(adjustedValue);
  };

  const handleValueChange = (value) => {
    const nonLinearValue = mapValueToNonLinearScale(value);
    setMon(nonLinearValue);
  };

  const realm = useRealm();

  const toggleDay = (day) => {
    setWeek((prevWeek) => {
      if (prevWeek.includes(day)) {
        return prevWeek.filter(d => d !== day);  // Remove day from week
      } else {
        return [...prevWeek, day];  // Add day to week
      }
    });
  };

  const isSelected = (day) => week.includes(day);

  function convertUTCtoIST(utcDate) {
    // Create a new Date object from the UTC date string
    const date = new Date(utcDate);
  
    // Calculate IST offset from UTC: +5 hours and 30 minutes
    const offset = 5 * 60 + 30; // 5 hours * 60 minutes + 30 minutes
  
    // Apply the IST offset (in milliseconds)
    const istDate = new Date(date.getTime());
  
    return istDate;
  }

  async function connect() {
    if(week.length == 0) scheduleNotification(title, new Date(convertUTCtoIST(date)));
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 5);
    newDate.setMinutes(newDate.getMinutes() + 30);
    
    
   await realm.write(() => {
      realm.create(Task, {
        _id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: newDate,
        dur,
        mon,
        comp: 0,
        title,
        week,
        status: week.length > 0? 'inactive' : 'undone',
      });
    });

    const tasks = realm.objects(Task);
    dispatch(setDb(tasks));
    setDate(new Date());
   
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(172, 218, 232, 0.93)', 'rgba(229, 244, 249, 0.93)']}
        start={{ x: 0.2, y: 0.8 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Task</Text>
          <Image
            resizeMode="contain"
            source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/27964fa6c828dcea498281636964f1ff242b8366789b33cddba81c917c00a400?apiKey=2a38c587787c4f68bb9ff72712a54e47&" }}
            style={styles.headerIcon}
          />
        </View>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(value) => setTitle(value)}
          placeholder="Task title"
          placeholderTextColor="#000"
        />

        <DatePicker
          date={date}
          onDateChange={setDate}
          mode="datetime"
          style={styles.datePicker}
        />

       { /* <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.switch}
        /> */ }

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>{dur} mins</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={60}
            step={1}
            value={dur}
            onValueChange={(value) => setDur(value)}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1fb28a"
          />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Rs. {mon}</Text>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={300}
            step={1}
            value={mon}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1fb28a"
          />
        </View>

        {/* Day Selection Buttons */}
        <View style={styles.weekContainer}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              style={[
                styles.dayButton,
                isSelected(day) && { backgroundColor: "lightblue" },
              ]}
            >
              <Text style={styles.dayText}>{day}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.submitButton} onPress={connect}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  gradient: {
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 20,
    color: "#009DCC",
    fontWeight: "700",
  },
  headerIcon: {
    width: 30,
    height: 30,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#009DCC",
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  datePicker: {
    alignSelf: "center",
    marginBottom: 15,
  },
  switch: {
    alignSelf: "center",
    marginBottom: 15,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  sliderLabel: {
    fontSize: 16,
    color: "#009DCC",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#009DCC",
  },
  dayText: {
    color: "#009DCC",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#009DCC",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
