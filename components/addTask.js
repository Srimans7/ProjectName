import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import Slider from "@react-native-community/slider";

import { useDispatch } from 'react-redux';
import { setDb } from '../redux/actions';
import { scheduleNotification } from '../notify';
import { useNavigation } from '@react-navigation/native';

import api from '../axiosService';

export default function AddTask() {
  const [date, setDate] = useState(new Date());
  const [dur, setDur] = useState(5);
  const [mon, setMon] = useState(10);
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const dispatch = useDispatch();

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

  // Convert UTC date to IST date
  function convertUTCtoIST(utcDate) {
    const date = new Date(utcDate);
    return new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000); // Add 5 hours 30 minutes
  }

  // Map slider value to non-linear scale for "mon"
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

  // Submit new task to the server
  const submitTaskToServer = async () => {
    console.log("BUTTONED")
    const newDate = convertUTCtoIST(date);
    
    const newTask = {
      date: newDate,
      dur,
      mon,
      comp: 0,
      title,
      week,
      status: week.length > 0 ? 'inactive' : 'undone',
    };

    try {
      // Make POST request to add a new task to the server
      const response = await api.post('http://10.0.2.2:3001/task', newTask); // Replace with your server URL
      console.log('Task added:', response.data);

      // Dispatch the updated tasks to Redux
      const tasksResponse = await api.get('http://10.0.2.2:3001/tasks'); // Fetch updated tasks
      dispatch(setDb(tasksResponse.data));

      // Schedule notification if no repeat days are selected
      if (week.length === 0) {
        scheduleNotification(title, new Date(date));
      }

      // Reset fields after submitting
      setDate(new Date());
      setDur(5);
      setMon(10);
      setTitle('');
      setWeek([]);
      
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

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
{/*
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>{dur} mins</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={60}
            step={1}
            value={dur}
            onValueChange={setDur}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1fb28a"
          />
        </View>
*/}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Set Credit : {mon}</Text>
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

        {

        /*
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
        </View> */
}

        <Pressable style={styles.submitButton} onPress={submitTaskToServer}>
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
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#009DCC",
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "white"
  },
  datePicker: {
    alignSelf: "center",
    marginBottom: 15,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  sliderLabel: {
    fontSize: 20,
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
