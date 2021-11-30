import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const DiagnosisScreen = ({ route }) => {
  const navigation = useNavigation();
  const chart = route.params.chart;
  const imagePath = route.params.image;
  console.log('chart: ' + JSON.stringify(chart));
  const renderDiagnosis = diagnosis => {
    if (diagnosis != '건강한') {
      return (
        <View
          style={{
            height: screenHeight * 0.3,
            padding: 10,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={[styles.diagnosisText, { textAlign: 'center' }]}
          >{`지금 ${chart.plant_name}(은/는)`}</Text>

          <Text
            style={[
              styles.diagnosisText,
              { textAlign: 'center', fontSize: 24, color: 'red' },
            ]}
          >{`${chart.diagnosisResult.disease_model}`}</Text>
          <Text style={[styles.diagnosisText, { textAlign: 'center' }]}>
            이라는 병을 앓고 있어요 ㅜㅜ
          </Text>
          <Text
            style={[styles.diagnosisText, { fontSize: 14 }]}
          >{`\n질병진단 인공지능의 판단:\n\n${
            chart.diagnosisResult.disease_model
          }을 앓고 있을 확률이 ${
            Math.round(Number(chart.diagnosisResult.percent_model * 1000)) /
            1000
          }%에요.`}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: screenHeight * 0.3,
            padding: 10,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={styles.diagnosisText}
          >{`지금 ${chart.plant_name}(은/는) `}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={[
                styles.diagnosisText,
                {
                  color: '#93d07d',
                  fontFamily: 'NanumGothicExtraBold',
                  fontSize: 24,
                },
              ]}
            >
              건강
            </Text>
            <Text style={styles.diagnosisText}> 해요!</Text>
          </View>

          <Text
            style={styles.diagnosisText}
          >{`질병진단 인공지능의 판단:\n\n건강할 확률이 ${
            Math.round(Number(chart.diagnosisResult.percent_model * 1000)) /
            1000
          }%에요.`}</Text>
        </View>
      );
    }
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 15,
      }}
    >
      <Text
        style={{
          fontFamily: 'NanumGothicExtraBold',
          fontSize: 20,
          color: '#363636',
        }}
      >
        진단표
      </Text>
      <Image source={{ uri: imagePath }} style={{ width: 300, height: 300 }} />
      {renderDiagnosis(chart.diagnosisResult.disease_model)}
      <TouchableOpacity
        style={styles.ModalButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text
          style={{
            fontFamily: 'NanumGothicBold',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          확인
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  diagnosisText: {
    fontFamily: 'NanumGothicBold',
    fontSize: 16,
    color: '#363636',
  },
  ModalButton: {
    width: 60,
    height: 40,
    backgroundColor: '#93d07d',
    borderRadius: 3,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default DiagnosisScreen;
