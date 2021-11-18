import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Footer from '../component/Footer';

ShopScreen = () => {
  return (
    <View
      style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
      <Text>ShopScreen</Text>
      <Footer name={'Shop'}/>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ShopScreen;
