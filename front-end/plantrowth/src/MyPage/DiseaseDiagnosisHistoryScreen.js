import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  View,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DiseaseDiagnosisScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.body}>
     <Text>질병진단 내역 조회 스크린</Text>
      <Footer />
    </View>
  )
};



const styles = StyleSheet.create({

  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default DiseaseDiagnosisScreen;