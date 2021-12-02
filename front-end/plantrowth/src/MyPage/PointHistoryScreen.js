import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  View,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native';

import Footer from '../component/Footer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPointList } from '../actions/UserActions';
import { useIsFocused } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
        <MaterialCommunityIcons name={'alpha-p-circle'} color={'yellow'} size={20} />
       
        <Text style={styles.text}>{item.diagnosis_date} 질병진단 결과</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginStart: Dimensions.get('window').width * 0.05,
        }}
      >
        <View style={styles.textWrapper}>
          <View style={{ flexDirection: 'row' }}>
           <Text style={styles.text}>{item.remain_point}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
//작성중
const PointHistoryScreen = ({ navigation }) => {

  const [pointNum, setPointNum] = useState('');

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const pointList = useSelector(state => state.UserReducer.pointList);

  useEffect(() => {
    if(isFocused){
      AsyncStorage.getItem('userId').then(value => {
        if (value != null) {
          dispatch(getPointList(value));
        }
      })

    }
  }, [isFocused])

  const renderItem = ({ item, index }) => {

    return (
      <Item
        item={item}
        onPress={() => {
          setPointNum(index);
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
          onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back-sharp' size={23} color="#000000" />
        </TouchableOpacity>
        <Text style={{ marginEnd: Dimensions.get('window').width * 0.36, fontWeight: "bold", color: "#000000" }}>포인트 내역 조회</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FlatList
            data={pointList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()} 
            extraData={pointNum}
          />
      </View>
      <Footer name={'My Page'}/>
    </SafeAreaView>
  )
};



const styles = StyleSheet.create({

  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C9E7BE'
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
  textWrapper: {
    justifyContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.07

  },
})

export default PointHistoryScreen;