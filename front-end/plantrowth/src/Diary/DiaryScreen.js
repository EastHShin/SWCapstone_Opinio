import React, { useState, useEffect } from 'react';

import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Text,
  Dimensions
} from 'react-native';

import Evillcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { fetchDiaries } from '../actions/DiaryActions';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native'
import LevelUp from '../LevelUp';

const Item = ({ item, onPress, style }) => {

  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View>
        <Text style={styles.content}>
          {item.content.length > 33 ? (item.content.substring(0, 31) + "···") : item.content}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
}


const DiaryScreen = ({ route,navigation }) => {
  
  const {plantId, plantImg} = route.params; 

  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const diaries = useSelector(state => state.DiaryReducer.diaries);
  const isFocused = useIsFocused();



  useEffect(() => {
    if(isFocused){
    dispatch(fetchDiaries(plantId)); 
  }
  }, [isFocused])


  const renderItem = ({ item }) => {

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.diary_id);
          navigation.push("DiaryDetailScreen", {selectedId:item.diary_id,plantId:plantId,plantImg:plantImg});
        }
        }
        style={{ backgroundColor: "#FFFFFF" }}
      />
    )
  };

  return (
    <SafeAreaView style={styles.body}>
      	<LevelUp />
      <View style={styles.top}>
        <Image
          source={{ uri: plantImg }} 
          style={styles.image}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.push("DiaryCreateScreen", {plantId:plantId, plantImg:plantImg})}>
          <SimpleLineIcons name='note' size={25} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.diaryWrapper}>
        {diaries.length == 0 ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("DiaryCreateScreen", {plantId:plantId, plantImg:plantImg})}>
            <Evillcons name='plus' size={80} color="#DCDCDC" style={styles.icon} />
          </TouchableOpacity>
        ) : null}

        <FlatList
          data={diaries}
          renderItem={renderItem}
          keyExtractor={item => item.diary_id}
          extraData={selectedId}
        />
      </View>
    </SafeAreaView>
  )
}
export default DiaryScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#8EB695",
    alignItems: 'center',
    justifyContent: 'center'
  },
  top: {
    flexDirection: "row",
    justifyContent: "center",
    height: Dimensions.get('window').height * 0.05,
  },
  diaryWrapper: {
    height: Dimensions.get('window').height * 0.83,
    width: Dimensions.get('window').width,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 30,
  },
  title: {
    fontSize: 15,
    color: "#000000"
  },
  content: {
    fontSize: 13
  },
  date: {
    color: "#DCDCDC",
    fontSize: 10,
  },
  icon: {
    marginTop: Dimensions.get('window').height / 3,
    marginStart: Dimensions.get('window').width * 0.4
  },
  image: {
    width: '40%',
    height: Dimensions.get('window').height * 0.1,
    marginTop: Dimensions.get('window').height * -0.045,
    marginRight: Dimensions.get('window').width * 0.15,
    marginLeft: Dimensions.get('window').width * 0.23,
    resizeMode: 'contain',
  },

})