import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const DiagnosisScreen = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
      <Text>DiagnosisScreen</Text>
      <Button title="back" onPress={()=>{navigation.goBack()}}/>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DiagnosisScreen;
