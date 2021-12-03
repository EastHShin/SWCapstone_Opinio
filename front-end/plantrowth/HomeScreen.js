import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import Footer from './src/component/Footer';
import Loader from './src/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomeInfo } from './src/actions/HomeActions';
import { setPost } from './src/actions/CommunityActions';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Moment from 'moment';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const Item = ({ item, onPress, style }) => {
  const nowYear = new Date().getFullYear();
  const boardCreateDate = new Date(item.createDate);
 
    return (
      <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={{ marginBottom: Dimensions.get('window').height * 0.01 }}>
          <Text style={styles.content}>
            {item.content.length > 33
              ? item.content.substring(0, 31) + '···'
              : item.content}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            {nowYear == boardCreateDate.getFullYear() ? (
              <Text style={styles.date}>
                {Moment(item.createDate).format('MM/DD HH:mm')}
              </Text>
            ) : (
              <Text style={styles.date}>
                {Moment(item.createDate).format('YYYY/MM/DD HH:mm')}
              </Text>
            )}

            <Text
              style={{ fontSize: 10, color: '#DCDCDC', fontWeight: 'bold' }}
            >
              {' '}
              |{' '}
            </Text>
            <Text style={styles.date}>{item.writer}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={12}
              color="#DC143C"
            />
            <Text
              style={{
                fontSize: 9,
                color: '#DC143C',
                marginLeft: Dimensions.get('window').width * 0.01,
                marginRight: Dimensions.get('window').width * 0.02,
              }}
            >
              {item.countedLike}
            </Text>
            <SimpleLineIcons name="bubble" size={12} color="#00BFFF" />
            <Text
              style={{
                fontSize: 9,
                color: '#00BFFF',
                marginHorizontal: Dimensions.get('window').width * 0.01,
              }}
            >
              {item.countedComments}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
}

HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState('');
  const [boards, setBoards] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const infoList = useSelector(state => state.HomeReducer.infoList);
  const [name, setName] = useState('');
  const isLogin = useSelector(state => state.UserReducer.isLogin);
  let plantNumber = 0;


  useEffect(() => {
    if (isLogin == 'end') {
      navigation.reset({ routes: [{ name: 'LoginScreen' }] });
    }
  }, [isLogin]);

  useEffect(() => {
    dispatch(setPost());
    AsyncStorage.getItem('userId').then(value => {
      if (value != null) {
        setUserId(JSON.parse(value));
        console.log('userId: ' + userId);
        if (isFocused) {
          dispatch(getHomeInfo(JSON.parse(value)));
          setLoading(false);
        }
      }
    });
  }, [isFocused]);

  useEffect(() => {
    setBoards(infoList.boards);
  }, [infoList])


  const renderItem = ({item}) => {

    if(!item.is_blocked){
    return (
      <View>
        <Item
          item={item}
          onPress={() => {
            setSelectedId(item.board_id);
            navigation.navigate('PostDetailScreen', {
              selectedId: item.board_id,
            });
          }}
          style={{ backgroundColor: '#FFFFFF' }}
        />
      </View>
    );
      }
      else{
        return (
          <View style={{ width: Dimensions.get('window').width }}></View>
        )
      };
  };


  const renderPlantList = PlantList => {
    if (PlantList !== null && PlantList !== undefined) {
      return PlantList
        ? PlantList.map((item, index) => {
            console.log('hi:' + item);
            plantNumber++;
            return (
              <TouchableOpacity
                style={styles.profileContainer}
                key={index}
                onPress={() => {
                  navigation.navigate('ManagePlantScreen', {
                    plantId: item.plant_id,
                    point: infoList.point,
                  });
                }}
              >
                <Image
                  source={{ uri: item.file_name }}
                  style={styles.profileImage}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'NanumGothicExtraBold',
                      color: '#363636',
                    }}
                  >
                    {`LV.${item.plant_level}`}
                  </Text>
                  <View style={styles.levelBar}>
                    <View
                      style={[
                        styles.expBar,
                        {
                          width:
                            (screenWidth * 0.17 * item.plant_exp) /
                            ((item.plant_level - 1) * 10 + 30),
                        },
                      ]}
                    >
                      <Text
                        style={{
                          width: screenWidth * 0.17,
                          textAlign: 'center',
                          fontFamily: 'NanumGothicExtraBold',
                          color: '#363636',
                        }}
                      >
                        {item.plant_exp} / {(item.plant_level - 1) * 10 + 30}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.nameWrapper}>
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      textAlign: 'center',
                      fontSize: 12,
                      color: '#363636',
                    }}
                  >
                    {item.plant_name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        : null;
    }
  };

  const renderProfileAddSlot = max_plant_num => {
    let arr = [];
    for (let i = 0; i < max_plant_num - plantNumber; i++) {
      arr.push(1);
    }
    return arr
      ? arr.map((value, index) => {
          return (
            <TouchableOpacity
              style={[styles.profileContainer, { justifyContent: 'center' }]}
              onPress={() =>
                navigation.navigate('AddProfileScreen', { userId: userId })
              }
              key={index}
            >
              <Icon name={'add'} color={'white'} size={60} />
            </TouchableOpacity>
          );
        })
      : null;
  };
  const PlantList = () => {
    return (
      <View style={styles.plantListWrapper}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
          style={{
            borderRadius: 10,
            paddingTop: 5,
          }}
        >
          {renderPlantList(infoList.plants)}
          {renderProfileAddSlot(infoList.max_plant_num)}
          {plantNumber == infoList.max_plant_num ? (
            <TouchableOpacity
              style={[styles.profileContainer, { justifyContent: 'center' }]}
              onPress={() => navigation.navigate('ShopScreen')}
            >
              <Text style={{ fontFamily: 'NanumGothicBold' }}>
                프로필 슬롯 추가
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <Loader loading={loading} />
      <View
        style={{
          backgroundColor: '#C9E7BE',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.memberInfoSectionWrapper}>
          <Icon name={'person-circle-outline'} size={45} color={'gray'} />
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: 16,
                color: '#666666',
                fontFamily: 'NanumGothic',
              }}
            >
              환영합니다! {infoList.user_name}님
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#666666',
                fontFamily: 'NanumGothic',
              }}
            >
              보유 포인트: {infoList.point}
            </Text>
          </View>
        </View>
        <View style={styles.plantListSectionWrapper}>
          <Text style={{ color: '#666666', fontFamily: 'NanumGothicBold' }}>
            내 식물들
          </Text>
          <PlantList />
        </View>
        <View style={styles.hotSectionWrapper}>
          <Text style={{ color: '#666666', fontFamily: 'NanumGothicBold' }}>
            인기 게시물
          </Text>
          <FlatList
            data={boards}
            renderItem={renderItem}
            keyExtractor={item => item.board_id}
            extraData={selectedId}
          />
        </View>
        <Footer name={'Home'} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  memberInfoSectionWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    margin: 5,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  plantListSectionWrapper: {
    backgroundColor: '#fff',
    flex: 5,
    borderRadius: 15,
    margin: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  advertisementSectionWrapper: {
    flex: 0.8,
    justifyContent: 'center',
    backgroundColor: '#f7f8f9',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  hotSectionWrapper: {
    flex: 3.45,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  plantListWrapper: {
    flex: 1,
    padding: 2,
  },
  profileContainer: {
    width: screenWidth * 0.274,
    height: screenHeight * 0.1 + screenWidth*0.274 + 13,
    padding: 5,
    backgroundColor: '#C9E7BE',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    borderRadius: 10,
  },
  profileImage: {
    width: screenWidth * 0.26,
    height: screenWidth * 0.26,
    borderRadius: (screenWidth * 0.26) / 2,
    backgroundColor: '#93d07d',
    borderWidth: 3,
    borderColor: '#93d07d',
  },
  nameWrapper: {
    backgroundColor: 'white',
    width: screenWidth * 0.26,
    height: screenHeight * 0.07,
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  levelBar: {
    backgroundColor: 'white',
    width: screenWidth * 0.17,
    height: screenHeight * 0.03,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  expBar: {
    backgroundColor: '#f1c40f',
    height: screenHeight * 0.03,
    borderRadius: 5,
    justifyContent: 'center',
  },
  item: {
    padding: 3,
    marginTop:Dimensions.get('window').height * 0.008
  },
  title: {
    fontSize: 13,
    color: "#000000"
  },
  content: {
    fontSize: 11
  },
  date: {
    color: "#A9A9A9",
    fontSize: 8,
  },
});

export default HomeScreen;
