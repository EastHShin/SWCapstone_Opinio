import React from 'react';
import {StyleSheet, View, Text, Button, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const DiagnosisScreen = ({route}) => {
  const navigation = useNavigation();
  const chart = route.params.chart;
  const imagePath = route.params.image;
  console.log('chart: '+JSON.stringify(chart));
  return (
    <View
      style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
      <Text>DiagnosisScreen</Text>
      <Image source={{uri: imagePath}} style={{width: 300, height: 300}}/>
      <Text style={styles.diagnosisText}>{`지금 ${chart.plant_name}은 ${chart.diagnosisResult.disease_model}이라는 병을 앓고 있어요 ㅜㅜ`}</Text>
      <Text>{`최첨단 인공지능의 판단: ${chart.diagnosisResult.disease_model}을 앓고 있을 확률: ${chart.diagnosisResult.percent_model}%`}</Text>
      <Button title="back" onPress={()=>{navigation.goBack()}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  diagnosisText: {
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default DiagnosisScreen;
