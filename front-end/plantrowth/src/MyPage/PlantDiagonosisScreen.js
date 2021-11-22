import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { getDiagnosisList } from '../actions/UserActions';
import { useIsFocused } from '@react-navigation/core';



const PlantDiagnosisScreen = ({ route,navigation }) => {
  const {selectedId} = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const diagnosisList =  useSelector(state => state.UserReducer.diagnosisList);

  useEffect(() => {
      if(isFocused){
          dispatch(getDiagnosisList(selectedId));
      }
  }, [isFocused])
  
  return (
    <View style={styles.body}>
     <Text>포인트 조회 스크린</Text>
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

export default PlantDiagnosisScreen;