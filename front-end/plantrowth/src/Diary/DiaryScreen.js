import React, { useState, useEffect } from 'react';

import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchDiaries } from '../actions/DiaryActions';
import { setEarnState } from '../actions/PlantActions';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import LevelUp from '../LevelUp';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Modal from 'react-native-modal';

const Item = ({ item, onPress, style }) => {

  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View>
        <Text style={styles.title}>
        {item.title.length > 20 ? (item.title.substring(0, 18) + "···") : item.title}
        </Text>
      </View>
      <View>
        <Text style={styles.content}>
          {item.content.length > 24 ? (item.content.substring(0, 22) + "···") : item.content}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const DiaryScreen = ({ route, navigation }) => {

  const { plantId, plantImg } = route.params;
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const diaries = useSelector(state => state.DiaryReducer.diaries);
  const isFocused = useIsFocused();
  const [isEarnModalVisible, setEarnModalVisibility] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const earnState = useSelector(state => state.PlantReducer.earn);
  const exp = useSelector(state=>state.DiaryReducer.exp);
  const point = useSelector(state=>state.DiaryReducer.point);
  const plant_level = useSelector(state=>state.DiaryReducer.level);

  useEffect(() => {
  
    if (isFocused) {
      dispatch(fetchDiaries(plantId));
    }
  }, [isFocused])

  useEffect(() => {
    setIsFetching(false);
  }, [diaries])

  const renderExp = () => {
    if (plant_level) {
      if (plant_level == 1) return 30;
      else return 30 + (plant_level - 1) * 10;
    } else return 0;
  };

  const refreshList = () => {
    setIsFetching(true);
    dispatch(fetchDiaries(plantId));
  }

  const renderEarnPoint = () => {
      return (
        <View>
          <Text style={styles.earnText}>포인트를 10만큼 획득하셨어요!</Text>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[styles.earnText, { fontSize: 16 }]}>보유 포인트:</Text>
            <Text
              style={[
                styles.earnText,
                {
                  fontSize: 16,
                  fontFamily: 'NanumGothicExtraBold',
                  color: '#7e57c2',
                },
              ]}>
              {' '}
              {point}
            </Text>
            <Entypo name={'arrow-up'} size={20} color={'#93d07d'} />
          </View>
        </View>
      );
  };
  const renderItem = ({ item }) => {

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.diary_id);
          navigation.push("DiaryDetailScreen", { selectedId: item.diary_id, plantId: plantId, plantImg: plantImg });
        }
        }
        style={{ backgroundColor: "#FFFFFF" }}
      />
    )
  };

  return (
    <SafeAreaView style={styles.body}>
      <LevelUp plant_level = {plant_level} />
      <View style={styles.top}>
        <Image
          source={{ uri: plantImg }}
          style={styles.image}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.push("DiaryCreateScreen", { plantId: plantId, plantImg: plantImg })}>
          <SimpleLineIcons name='note' size={25}  color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.diaryWrapper}>
        {diaries.length == 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: Dimensions.get('window').height * 0.3 }}>
            <MaterialCommunityIcons name='clover' size={20} color="#FFFFFF" />
            <Text style={{ fontSize: 15, color: "#FFFFFF", fontWeight: "bold", marginVertical: Dimensions.get('window').height * 0.02 }}>식물과의 추억을 기록해보세요</Text>

          </View>
        ) : null}

        <FlatList
          data={diaries}
          renderItem={renderItem}
          keyExtractor={item => item.diary_id}
          // onRefresh= {refreshList}
          // refreshing={isFetching}
          extraData={selectedId}
        />
      </View>
      <Modal
        isVisible={earnState}
        onBackButtonPress={()=>dispatch(setEarnState(false))}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: screenWidth * 0.65,
              height: screenHeight * 0.5,
              backgroundColor: 'white',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 10,
              borderRadius: 10,
            }}>
            {/* <EarnModal point={point}/> */}
            <View
              style={{
                marginTop: 5,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.earnText, { fontSize: 18 }]}>축하드려요!</Text>
              {renderEarnPoint()}
              <Text style={styles.earnText}>경험치를 10만큼 획득하셨어요!</Text>
              <View style={styles.expWrapper}>
                <View style={[styles.levelBar, { width: screenWidth * 0.5 }]}>
                  <View
                    style={[
                      styles.expBar,
                      {
                        width: exp
                          ? (screenWidth * 0.5 * exp) / renderExp()
                          : 0,
                      },
                    ]}>
                    <Text
                      style={{
                        width: screenWidth * 0.5,
                        textAlign: 'center',
                        fontFamily: 'NanumGothicBold',
                        color: '#363636',
                      }}>
                      {`LV. ${plant_level} ( ${exp
                        } / ${renderExp()} )`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                  dispatch(setEarnState(false));
                  setEarnModalVisibility(false);
              }}>
              <View style={styles.earnModalButton}>
                <Text
                  style={{ fontFamily: 'NanumGothicBold', textAlign: 'center' }}>
                  확인
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>
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
    justifyContent: "space-between",
    height: Dimensions.get('window').height * 0.05,
    marginStart:Dimensions.get('window').width*0.1
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.00,
    elevation: 5
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
 
  image: {

    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').height * 0.1,
    borderRadius: 10,
    backgroundColor: '#93d07d',
    borderWidth: 2,
    borderColor: '#93d07d',
    marginTop: Dimensions.get('window').height * -0.045,
    marginRight: Dimensions.get('window').width * 0.21,
    marginLeft: Dimensions.get('window').width * 0.23,
    resizeMode: 'cover',
  },
  expWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelBar: {
    backgroundColor: 'white',
    width: screenWidth * 0.6,
    height: screenHeight * 0.03,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  expBar: {
    backgroundColor: '#f1c40f',
    height: screenHeight * 0.03,
    borderRadius: 5,
    justifyContent: 'center',
  },
  earnModalButton: {
    width: 50,
    height: 35,
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
  earnText: {
    fontFamily: 'NanumGothicBold',
    marginTop: 10,
    marginBottom: 5,
    color: '#363636',
    fontSize: 13,
  },
})