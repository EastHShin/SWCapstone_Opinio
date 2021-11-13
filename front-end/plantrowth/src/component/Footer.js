import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Footer = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.tabLabel}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('CommunityScreen')}>
        <Text style={styles.tabLabel}>커뮤니티</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('ShopScreen')}>
        <Text style={styles.tabLabel}>상점</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('MyPageScreen')}>
        <Text style={styles.tabLabel}>마이페이지</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    width: screenWidth * 0.25,
    height: 60,
    backgroundColor: '#A0A0A0',
    borderColor: 'gray',
    borderWidth: 1,
  },
  tabs: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: '#A0A0A0',
  },
});

export default Footer;
