import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/dist/Ionicons';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Footer = (route) => {
  const navigation = useNavigation();
  console.log('footer:' + route.name);
  const menuList = [
    {
      iconName: 'home-outline',
      name: 'Home',
      link: 'HomeScreen',
    },
    {
      iconName: 'newspaper-outline',
      name: 'Community',
      link: 'CommunityScreen',
    },
    {
      iconName: 'basket-outline',
      name: 'Shop',
      link: 'ShopScreen',
    },
    {
      iconName: 'person-outline',
      name: 'My Page',
      link: 'MyPageScreen',
    }
  ];

  return (
    <View style={styles.tabs}>
      {menuList.map((item, index) => {
        return (
          <TouchableOpacity style={item.name == route.name ? [styles.tabButton, { backgroundColor: '#C9E7BE' }] : styles.tabButton} key={index} onPress={() => { navigation.navigate(item.link) }}>
            {/* {item.name == route.name ? <Icon name={item.iconName} /> : <Icon name={item.iconName}/>} */}
            <Icon name={item.iconName} size={item.name == route.name ? 32 : 27} color={item.name == route.name ? 'white' : '#C9E7BE'} />
            <Text style={item.name == route.name ? [styles.tabLabel, { color: 'white' }] : styles.tabLabel}>{item.name}</Text>
          </TouchableOpacity>
        )
      })}
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    textAlign: 'center',
    color: '#C9E7BE',
    fontWeight: 'bold',
  },
  tabButton: {
    paddingTop: 5,
    alignItems: 'center',
    width: screenWidth * 0.25,
    height: 60,
    backgroundColor: '#82B594',
    // borderColor: 'gray',
    // borderWidth: 1,
  },
  tabs: {
    marginTop: 5,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderTopWidth: 0.5,
    // borderColor: '#A0A0A0',
  },
});

export default Footer;
