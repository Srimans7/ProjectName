import PushNotification from "react-native-push-notification";

// Configure PushNotification
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    // Process the notification here (optional)
  },

  // Request permissions on iOS
  requestPermissions: Platform.OS === 'ios'
});

// Create a channel if it doesn't exist
PushNotification.createChannel(
  {
    channelId: "your-channel-id", // Unique channel id for Android
    channelName: "Your Channel Name", // Name of the channel
    channelDescription: "A channel to categorize your notifications", // (optional) A description of the channel
    soundName: "default", // (optional) Specify a sound to play when notification is triggered
    importance: 4, // (optional) default: 4. Specifies the priority of the notification
    vibrate: true, // (optional) default: true. Will the notification vibrate.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback to check if channel was created, returns `true` or `false`
);

// Function to schedule a notification
function scheduleNotification(title, date) {
  PushNotification.localNotificationSchedule({
    channelId: "your-channel-id", // Use the same channel id
    title: title, // Notification title
    message: `Complete ${title}`, // Notification message
    date: new Date(date), // Schedule the notification at this date and time
    allowWhileIdle: true, // Set to `true` if the notification should fire even when the device is idle
    playSound: true, // Play a sound when the notification is triggered
    soundName: 'default', // Use the default notification sound
    vibrate: true, // Vibrate when the notification is triggered
    vibration: 300, // Vibration duration in milliseconds
  });
}

// Export the scheduleNotification function
export { scheduleNotification };
