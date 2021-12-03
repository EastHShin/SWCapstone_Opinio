import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDiagnosisList } from '../actions/UserActions';
import { useIsFocused } from '@react-navigation/core';

const Item = ({ item}) => {

  return (
    <View style={styles.section}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: Dimensions.get('window').height * 0.01,
        }}
      >
        <Ionicons
          name="md-document-text-outline"
          size={23}
          color="#000000"
          style={styles.documentIcon}
        />
        <Text style={styles.text}>{item.diagnosis_date} 질병진단 결과</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginStart: Dimensions.get('window').width * 0.05,
        }}
      >
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <View style={styles.textWrapper}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, color: '#000000' }}>상태 :</Text>
            {item.disease_name == '건강한' ? (
              <Text
                style={{
                  color: 'green',
                  marginLeft: Dimensions.get('window').width * 0.01,
                }}
              >
                건강
              </Text>
            ) : (
              <Text
                style={{
                  color: 'red',
                  marginLeft: Dimensions.get('window').width * 0.01,
                }}
              >
                {item.disease_name}
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 15, color: '#000000' }}>
            확률 : {Math.round(Number(item.disease_percent * 1000)) / 1000} %
          </Text>
        </View>
      </View>
    </View>
  );
}

const PlantDiagnosisScreen = ({ route, navigation }) => {
  const { selectedId } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const diagnosisList = useSelector(state => state.UserReducer.diagnosisList);
  const [diagnosisRecords, setDiagnosisRecords] = useState('');
  const [diagnosisNum, setDiagnosisNum] = useState('');

  useEffect(() => {
    if (isFocused) {
      dispatch(getDiagnosisList(selectedId));
    }
  }, [isFocused])

  useEffect(()=> {
    if(diagnosisList.length != 0){
    setDiagnosisRecords(diagnosisList.records.reverse());
    console.log(diagnosisList.records);
    };
  },[diagnosisList])

  const renderItem = ({ item, index }) => {

    return (
      <Item
        item={item}
        onPress={() => {
          setDiagnosisNum(index);
        }
        }
        style={{ backgroundColor: "#FFFFFF" }}
      />
    )
  };


  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.top}>
        <TouchableOpacity
          style={{ marginStart: Dimensions.get('window').width * 0.03 }}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-sharp" size={23} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            marginEnd: Dimensions.get('window').width * 0.35,
            fontWeight: 'bold',
            color: '#000000',
          }}
        >
          질병진단 내역 조회
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: Dimensions.get('window').width,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {diagnosisRecords.length > 0 ? (
          <FlatList
            data={diagnosisRecords}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()} 
            extraData={diagnosisNum}
          />
        ) : (
          <View style={{marginTop:Dimensions.get('window').height*0.4}}>
            <Text style={{fontSize:15, color:"#000000", fontWeight:"bold"}}>질병진단 내역이 존재하지 않습니다.</Text>
          </View>
        )}
      </View>
      <Footer name={'My Page'} />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({

  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#C9E7BE"
    
  },
  top: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width
  },
  section: {
    marginBottom: Dimensions.get('window').height * 0.0009,
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.211,
  },
  text: {
    color: '#000000',
    fontFamily: 'NanumGothicBold',
    marginLeft:Dimensions.get('window').width*0.02
  },
  documentIcon:{
    marginStart:Dimensions.get('window').width * 0.05,

  },
  image: {

    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').height * 0.13,
    resizeMode: 'cover',
    borderRadius: 10

  },
  textWrapper: {
    justifyContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.07

  },
})

export default PlantDiagnosisScreen;