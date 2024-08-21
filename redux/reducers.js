import { SET_DATA } from './actions';
import { SET_TEST_FUNCTION } from './actions';
import PushNotification from "react-native-push-notification";

PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
  
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    }
  
  });

const initialState = {
    db: [
        {
            _id: "66b0ad2a5bab8b0b2fccfeb3" ,
            date: 0,
            dur: 'int',
            comp: 'int',
            mon: 'int',
            title: "t1",
            week: ["Mon"],
            img: [
              "https://firebasestorage.googleapis.com/v0/b/apps-6cde5.appspot.com/o/images%2Frn_image_picker_lib_temp_bc13426a-8679-4fdf-973c-6291abb34220.jpg?alt=media&token=31c88dd5-f1d8-488c-a491-401fb0fc2975",
              ],
            status: 'over',
          }
          
    ],
    testFunction: (title, message) => {
        PushNotification.localNotification({
          title: title,
          message: message,
          channelId: "your-channel-id",
        });
      },
}



function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DATA: return { ...state, db: action.payload };
        case SET_TEST_FUNCTION:
      return {
        ...state,
        testFunction: action.payload,
      };
        default:
            return state;
    }
}


export default userReducer;