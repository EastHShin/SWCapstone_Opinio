import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Footer from '../component/Footer';

MyPageScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
      <Text>MyPageScreen</Text>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MyPageScreen;
