import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Footer from '../component/Footer';
CommunityScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
      <Text>CommunityScreen</Text>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CommunityScreen;
