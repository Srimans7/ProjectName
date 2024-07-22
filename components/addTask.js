import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Repeator from './repeat/Repeater';
import LinearGradient from 'react-native-linear-gradient';

export default function AddTask(){
  const [date, setDate] = useState(new Date());
  return (
    <View style={styles.container}>
    
      <View style={styles.content}>
      <LinearGradient
        colors={['rgba(172, 218, 232, 0.93)', 'rgba(229, 244, 249, 0.93)']}
        start={{ x: 0.2, y: 0.8 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Task</Text>
          <Image
            resizeMode="auto"
            source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/27964fa6c828dcea498281636964f1ff242b8366789b33cddba81c917c00a400?apiKey=2a38c587787c4f68bb9ff72712a54e47&" }}
            style={styles.headerIcon}
          />
        </View>
        <View style={styles.taskInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="title"
            placeholderTextColor="#000"
            accessibilityLabel="Enter task title"
          />
        </View>
        <DatePicker date={date} onDateChange={setDate} />
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
        
            <Pressable style={styles.nextButton}>
              <Text style={styles.nextButtonText}>next</Text>
            </Pressable>
          </View>
          
        
        </View>
        <Repeator />
        <View style={styles.submitButtonContainer}>
          <Pressable style={styles.button} accessibilityLabel="Submit task">
            <View style={styles.buttonInner} />
          </Pressable>
        </View>
        </LinearGradient>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    backgroundColor: "#A1D5E5",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 7,
    maxWidth: 334,
    alignSelf: "center",
  },
  content: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#009DCC",
    backgroundColor: "#FFF",
    flexDirection: "column",
    paddingVertical: 7,
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#009DCC",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
  headerIcon: {
    width: 37,
    aspectRatio: 1,
  },
  taskInputContainer: {
    marginTop: 23,
    alignSelf: "flex-start",
  },
  dateTimeContainer: {
    marginTop: 19,
    flexDirection: "column",
    gap: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#009DCC",
    backgroundColor: "#FFF",
    color: "#000",
    paddingVertical: 14,
    paddingHorizontal: 52,
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    shadowColor: "rgba(0, 144, 188, 0.91)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  nextButton: {
    borderRadius: 10,
    backgroundColor: "#009DCC",
    marginTop: 16,
    paddingVertical: 5,
    paddingHorizontal: 7,
    shadowColor: "rgba(0, 144, 188, 0.91)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
    textAlign: "center",
  },
  submitButtonContainer: {
    alignSelf: "flex-end",
    marginTop: 17,
    width: 50,
  },
  button: {
    width: "100%",
    height: 50,
  },
  buttonInner: {
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "rgba(255, 222, 102, 1)",
    backgroundColor: "#FFF",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    width: "100%",
    height: "100%",
  },
});

