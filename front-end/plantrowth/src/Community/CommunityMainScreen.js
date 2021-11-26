import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native';
import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { getBoardList } from '../actions/CommunityActions';
import { useIsFocused } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dataList = [
  {
    "id":1,
    "level" : 1,
    "title":"안녕하세요!",
    "content":"반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/2f6285c1-7571-4d33-80d3-f0b0e74bd5dc.jpg",
    "good":10,
    "comment":2,
    "createDate":"2021-11-05",
    "updateDate" : "2021-11-07",
    "writer" : "식물집사",
    "user_id" : 3,
    "commentList" : [
      {
        "comment_id" : 1,
        "user_id" : 1,
        "content" : "안녕하",
        "writer" : "식물집사",
        "date":"2021-11-05"
      },
      {
        "comment_id" : 7,
        "user_id" : 2,
        "content" : "안녕하",
        "writer" : "2번 유저",
        "date":"2021-11-25"
      },

  ]

  

  },
  {
    "id":2,
    "level" : 2,
    "title":"2안녕하세요!",
    "content":"2반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0137a962-2200-4f53-8255-ec1d654a837f.jpg",
    "good":5,
    "comment":4,
    "createDate":"2021-11-06",
    "updateDate" : "2021-11-08",
    "writer" : "나 !",
    "user_id" : 2,
    "commentList" : [
      {
        "comment_id" : 2,
        "user_id" : 1,
        "content" : "안녕하",
        "writer" : "1번 유저",
        "date":"2021-11-06"
      }
  ]

  },
  {
    "id":3,
    "level" : 3,
    "title":"3안녕하세요!",
    "content":"3반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0137a962-2200-4f53-8255-ec1d654a837f.jpg",
    "good":50,
    "comment":24,
    "createDate":"2021-11-09",
    "updateDate" : "",
    "writer" : "3번유저",
    "user_id" : 3,
    "commentList" : [
      {
        "comment_id" : 3,
        "user_id" : 2,
        "content" : "안녕하",
        "writer" : "1번 유저",
        "date":"2021-11-10"
      }
  ]

  },
  {
    "id":4,
    "level" : 2,
    "title":"4안녕하세요!",
    "content":"4반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0137a962-2200-4f53-8255-ec1d654a837f.jpg",
    "good":8,
    "comment":4,
    "createDate":"2021-11-11",
    "updateDate" : "2021-11-14",
    "writer" : "나 !",
    "user_id" : 2,
    "commentList" : [
      {
        "comment_id" : 4,
        "user_id" :1,
        "content" : "안녕하",
        "writer" : "1번 유저",
        "date":"2021-11-12"
      }
  ]
  },
  {
    "id":5,
    "level" : 6,
    "title":"5안녕하세요!",
    "content":"5반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0137a962-2200-4f53-8255-ec1d654a837f.jpg",
    "good":10,
    "comment":2,
    "createDate":"2021-11-14",
    "updateDate" : "",
    "writer" : "6번유저",
    "user_id" : 6,
    "commentList" : []

  },
  {
    "id":6,
    "level" : 2,
    "title":"6안녕하세요!",
    "content":"6반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0137a962-2200-4f53-8255-ec1d654a837f.jpg",
    "good":4,
    "comment":1,
    "createDate":"2021-11-18",
    "updateDate" : "2021-11-20",
    "writer" : "나 !",
    "user_id" : 2,
    "commentList" : [
      {
        "comment_id" : 5,
        "user_id" : 2,
        "content" : "안녕하",
        "writer" : "2번 유저",
        "date":"2021-11-18"
      }
  ]

  },
  {
    "id":7,
    "level" : 2,
    "title":"7안녕하세요!",
    "content":"7반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0137a962-2200-4f53-8255-ec1d654a837f.jpg",
    "good":10,
    "comment":2,
    "createDate":"2021-11-21",
    "updateDate" : "",
    "writer" : "2번유저",
    "user_id" : 2,
    "commentList" : []

  }, {
    "id":8,
    "level" : 1,
    "title":"8안녕하세요!",
    "content":"8반갑습니다~",
    "file_name": "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0137a962-2200-4f53-8255-ec1d654a837f.jpg",
    "good":100,
    "comment":51,
    "createDate":"2021-11-23",
    "updateDate" : "",
    "writer" : "1번유저",
    "user_id" : 1,
    "commentList" : [
      {
        "comment_id" : 6,
        "user_id" : 1,
        "content" : "안녕하",
        "writer" : "1번 유저",
        "date":"2021-11-23"
      }
  ]

  },
 
]

const reverseData = dataList.reverse();

const Item = ({ item, onPress, style }) => {

  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <View style={{marginBottom:Dimensions.get("window").height*0.01}}>
        <Text style={styles.content}>
          {item.content.length > 33 ? (item.content.substring(0, 31) + "···") : item.content}
        </Text>
      </View>
      <View style={{ alignItems: "center", justifyContent:"space-between", flexDirection:"row"}}>
        <View style={{flexDirection:"row"}}>
      <Text style={styles.date}>{item.createDate}</Text>
      <Text style={{fontSize:10, color:"#DCDCDC", fontWeight:'bold'}}> | </Text>
        <Text style={styles.date}>{item.writer}</Text>
        </View>
        <View style={{flexDirection:"row"}}>
        <MaterialCommunityIcons name='heart-outline' size = {14} color="#DC143C" />
        <Text style={{fontSize:10, color : "#DC143C", marginRight:Dimensions.get('window').width*0.02}}>{item.good}</Text>
        <SimpleLineIcons name = 'bubble' size ={14} color="#00BFFF"  />
        <Text style={{fontSize:10, color : "#00BFFF", marginRight:Dimensions.get('window').width*0.02}}>{item.comment}</Text>
      </View>
      </View>
      
    </TouchableOpacity>
  );
}


const CommunityMainScreen = ({ navigation }) => {

  const [selectedId, setSelectedId] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const boardList = useSelector(state => state.CommunityReducer.boardList);

  useEffect(() => {
    if(isFocused){
      dispatch(getBoardList());
    }
    
  }, [isFocused])

  // useEffect(() => {
  //   setIsFetching(false);
  // }, [boardList])
  
  // const refreshList = () => {
  //   setIsFetching(true);
  //   dispatch(getBoardList());
  // }

  const renderItem = ({ item }) => {

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.board_id);
          navigation.push("PostDetailScreen", {selectedId: item.board_id}); 
        }
        }
        style={{ backgroundColor: "#FFFFFF" }}
      />
    )
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#C9E7BE',
      }}
    >
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
            marginEnd: Dimensions.get('window').width * 0.01,
            fontFamily: 'NanumGothicBold',

            color: '#000000',
          }}
        >
          커뮤니티
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => console.log('ddd')}
          style={{ marginEnd: Dimensions.get('window').width * 0.02 }}
        >
          <Entypo name="dots-three-vertical" size={22} color="#000000" />
        </TouchableOpacity>
      </View>
      <View style={styles.boardWrapper}>
        {boardList != '' ? (
          <FlatList
            data={reverseData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={selectedId}
            //  onRefresh= {refreshList}
            // refreshing={isFetching}
          />
        ) : (
          <View style={{ width: Dimensions.get('window').width}}>
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.push('PostCreateScreen')}
          style={styles.fab}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <Footer name={'Community'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:"#C9E7BE"
  },
  top: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width
  },
 
  text: {
    color: '#000000',
    fontWeight: "bold",
    marginStart: Dimensions.get('window').width * 0.05,
  },
  icon: {
    marginEnd: Dimensions.get('window').width * 0.05,
  },

  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  boardWrapper: {
    flex: 1,
    padding: 2,
    
  },
  item: {
    padding: 20,
    marginVertical: 5,
    // marginHorizontal: 16,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.00,
    elevation: 5,
    width:Dimensions.get('window').width
  },
  title: {
    fontSize: 15,
    color: "#000000"
  },
  content: {
    fontSize: 13
  },
  date: {
    color: "#A9A9A9",
    fontSize: 10,
    
  },
  buttonText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,

  },
  fab: { 
    position: 'absolute', 
    width: 56, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#5F9EA0', 
    borderRadius: 30, 
    elevation: 8 
    }, 
    fabIcon: { 
      fontSize: 40, 
      color: 'white' 
    },
  




});

export default CommunityMainScreen;


