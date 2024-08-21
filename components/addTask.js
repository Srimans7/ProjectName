import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Switch, Image, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Repeator from './repeat/Repeater';
import LinearGradient from 'react-native-linear-gradient';
import Slider from "@react-native-community/slider";
import Realm from "realm";
import Task from './model';
import { useRealm } from '../RealmProvider';
import { useSelector, useDispatch } from 'react-redux';
import { setDb } from '../redux/actions';

export default function AddTask() {
  const [date, setDate] = useState(new Date());
  const [dur, setDur] = useState(5);
  const [mon, setMon] = useState(10);
  const [title, setTitle] = useState('');
  const [week, setWeek] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
  function weekData(data) {
    setWeek(data);
  }

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



  async function connect() {
    realm.write(() => {
      realm.create(Task, {
        _id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date,
        dur,
        mon,
        comp: 0,
        title,
        week,
        status: 'undone',
      });
    });

    const tasks = realm.objects(Task);
    dispatch(setDb(tasks));
    console.log(tasks);
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(172, 218, 232, 0.93)', 'rgba(229, 244, 249, 0.93)']}
        start={{ x: 0.2, y: 0.8 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Task</Text>
          <Image
            resizeMode="contain"
            source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/27964fa6c828dcea498281636964f1ff242b8366789b33cddba81c917c00a400?apiKey=2a38c587787c4f68bb9ff72712a54e47&" }}
            style={styles.headerIcon}
          />
        </View>

        {/* Task Title Input */}
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(value) => setTitle(value)}
          placeholder="Enter task title"
          placeholderTextColor="#000"
        />

        {/* Date Picker */}
        <DatePicker
          date={date}
          onDateChange={setDate}
          mode="datetime"
          style={styles.datePicker}
        />

        {/* Toggle Switch */}
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.switch}
        />

        {/* Duration Slider */}
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

        {/* Monetary Slider */}
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

        {/* Repeator Component */}
        {//<Repeator sendData={weekData} />
}
        {/* Submit Button */}
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
    backgroundColor: "#A1D5E5",
    paddingHorizontal: 20,
  },
  gradient: {
    borderRadius: 30,
    padding: 20,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#009DCC",
    fontWeight: "700",
  },
  headerIcon: {
    width: 40,
    height: 40,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#009DCC",
    backgroundColor: "#FFF",
    color: "#000",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 20,
  },
  datePicker: {
    alignSelf: "center",
    marginBottom: 20,
  },
  switch: {
    alignSelf: "center",
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 18,
    color: "#009DCC",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  submitButton: {
    backgroundColor: "#009DCC",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

