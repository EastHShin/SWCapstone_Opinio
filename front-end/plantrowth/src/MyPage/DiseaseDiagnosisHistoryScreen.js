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
  FlatList,
  Image
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getHomeInfo} from '../actions/HomeActions'
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Item = ({ item, onPress, style }) => {

  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View style={{flexDirection:"row"}}>
        <Image 
        source={{uri:item.file_name}}
        style={styles.image}
        />
        <View style={styles.textWrapper}>
          <Text style={{flexDirection:'column'}}>
          <Text style={styles.text}>Name  :    </Text>
        <Text style={styles.text}>
        {item.plant_name}
        </Text>
        </Text>
        <Text style={{flexDirection:'column'}}>
        <Text style={styles.text}>Level    :    </Text>
        <Text style={styles.text}>
        {item.plant_level}
        </Text>
        </Text>
        <Text style={{flexDirection:'column'}}>
        <Text style={styles.text}>EXP      :    </Text>
        <Text style={styles.text}>
        {item.plant_exp}
        </Text>
        </Text>
        </View>
      </View>
    
    </TouchableOpacity>
  );
}

const DiseaseDiagnosisScreen = ({ navigation }) => {

  const [selectedId, setSelectedId] = useState('');
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const infoList = useSelector(state => state.HomeReducer.infoList);
  const plantList = infoList.plants;

  useEffect(() => {
    if(isFocused){
      AsyncStorage.getItem('userId').then(value => {
        if (value != null) {
            dispatch(getHomeInfo(JSON.parse(value)));
        }
    }
    )
    }
  }, [isFocused])

  const renderItem = ({ item }) => {

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.plant_id);
          navigation.push("PlantDiagnosisScreen", { selectedId: item.plant_id });
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
        <Text style={{ marginEnd: Dimensions.get('window').width * 0.35, fontWeight: "bold", color: "#000000" }}>질병진단 내역 조회</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
     
      <FlatList
          data={plantList}
          renderItem={renderItem}
          keyExtractor={item => item.plant_id}
          extraData={selectedId}
        />
      
        <Footer />
      </View>
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
  text:{
    fontSize: 15,
    color: "#000000"
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  image:{
    
    width:Dimensions.get('window').width*0.25,
    height:Dimensions.get('window').height*0.13,
    resizeMode:'cover',
    borderRadius:10

  },
  textWrapper:{
    justifyContent:'center',
    marginLeft:Dimensions.get('window').width*0.07


  },
 

})

export default DiseaseDiagnosisScreen;