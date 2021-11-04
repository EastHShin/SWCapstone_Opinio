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
import { fetchDiaries } from './actions/diaryActions';
import { useSelector, useDispatch } from 'react-redux';

const Item = ({ item, onPress, style }) => {

  // const year = item.diary_date.getFullYear();
  // const month = ('0' + (item.diary_date.getMonth() + 1)).slice(-2);
  // const day = ('0' + item.diary_date.getDate()).slice(-2);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View>
        <Text style={styles.title}>{item.diary_title}</Text>
      </View>
      <View>
        <Text style={styles.content}>
          {item.diary_content.length > 33 ? (item.diary_content.substring(0, 31) + "···") : item.diary_content}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.date}>{item.diary_date}</Text>
      </View>
    </TouchableOpacity>
  );
}


const DiaryScreen = ({ navigation }) => {

  const [selectedId, setSelectedId] = useState(null)
  const dispatch = useDispatch();
  const diaries = useSelector(state => state.diaryReducer.diaries);

  useEffect(() => {
    dispatch(fetchDiaries(123));  //plant id는 식물 조회 완성되면 연결
  },[])

  const renderItem = ({ item }) => {

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.diary_id);
          navigation.push("DiaryDetailScreen",item.diary_id);
        }
      }
        style={{ backgroundColor: "#FFFFFF" }}
      />
    )
  };

  return (
    <SafeAreaView style={styles.body}>

   
      <View style={styles.top}>
      <Image
            source={require('./assets/plantrowth.png')}
            style={{
              width: '40%',
              height: 50,
              marginTop: Dimensions.get('window').height * -0.02,
              resizeMode: 'contain',
            
            }}
          />
          
      <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("DiaryCreateScreen")}>
            <SimpleLineIcons name='note' size={25} color="#FFFFFF" style={styles.noteIcon} />
          </TouchableOpacity>
      </View>
      <View style={styles.diaryWrapper}>
        {diaries.length == 0 ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("DiaryCreateScreen")}>
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
    flexDirection:"row",
    height: 40,
    
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
  noteIcon: {
    marginHorizontal: Dimensions.get('window').width / 6,
    marginTop: Dimensions.get('window').height * -0.01,
    marginEnd: Dimensions.get('window').height * -0.2,
  },
  
})