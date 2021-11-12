import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PlantList from './src/Plant/PlantList';
import { useNavigation } from '@react-navigation/core';
import Footer from './src/component/Footer';
import Loader from './src/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

MainScreen = () => {

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [userId, setUserId] = useState();

  AsyncStorage.getItem('userId').then(value => {
    if (value !== null) {
      setUserId(JSON.parse(value));
      console.log(userId);
    }
  }).catch(err => {
    console.log(err);
  })
  return (
    <SafeAreaView>
      <Loader loading={loading} />
      <View
        style={{
          backgroundColor: '#C9E7BE',
          height: '100%',
          justifyContent: 'space-between',
        }}>
        <View style={styles.memberInfoSectionWrapper}></View>
        <View style={styles.plantListSectionWrapper}>
          {/* <PlantList /> */}
        </View>
        <View style={styles.hotSectionWrapper}></View>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  memberInfoSectionWrapper: {
    flex: 2,
    backgroundColor: '#fff',
    //width: screenWidth*0.4,
    //height: screenHeight * 0.2,
    borderRadius: 15,
    margin: 5,
  },
  plantListSectionWrapper: {
    backgroundColor: '#fff',
    //width: screenWidth*0.4,
    flex: 6,
    borderRadius: 15,
    margin: 5,
    padding: 10,
  },
  hotSectionWrapper: {
    flex: 3,
    backgroundColor: '#fff',
    //width: screenWidth*0.4,
    //height: screenHeight * 0.2,
    borderRadius: 15,
    margin: 5,
  },
});

export default MainScreen;
