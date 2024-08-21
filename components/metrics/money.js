import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRealm } from '.../RealmProvider';
import { useSelector, useDispatch } from 'react-redux';
import { setDb } from '.../redux/actions';

function MyComponent({mn}) {
  return (
    <View style={styles.priceContainer}>
      <Text style={styles.priceText}>
        <Text style={styles.currency}>₹</Text>
        <Text style={styles.amount}> {mn} </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  priceContainer: {
    marginTop: 28,
    marginLeft: 15,
    marginRight: 15,
    textShadow: "2px 2px 5px #009DCC",
    borderRadius: 50,
    boxShadow: "0px 1px 10px 1px rgba(0, 144, 188, 0.91)",
    backgroundColor: "rgba(174, 225, 241, 0.40)",
    alignItems: "center",
    width: 158,
    justifyContent: "center",
    height: 158,
    padding: "0 13px",
    
  },
  priceText: {
    fontWeight: "900",
    fontSize: 51,
    color: "#FCC708",
    fontFamily: "Inter, sans-serif",
  },
  currency: {
    fontWeight: "900",
  },
  amount: {
    fontWeight: "900",
    color: "rgba(252,199,8,1)",
  },
});

export default MyComponent;