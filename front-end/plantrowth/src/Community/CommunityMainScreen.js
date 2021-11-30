import React,{useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  
} from 'react-native';
import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { getBoardList, setPost } from '../actions/CommunityActions';
import { useIsFocused } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';

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
        <Text style={{fontSize:10, color : "#DC143C", marginLeft:Dimensions.get('window').width*0.01,marginRight:Dimensions.get('window').width*0.02}}>{item.countedLike}</Text>
        <SimpleLineIcons name = 'bubble' size ={14} color="#00BFFF"  />
        <Text style={{fontSize:10, color : "#00BFFF", marginHorizontal:Dimensions.get('window').width*0.01}}>{item.countedComments}</Text>
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
      dispatch(setPost());
      dispatch(getBoardList());
    }
    
  }, [isFocused])

  useEffect(() => {
    setIsFetching(false);
  }, [boardList])


  
  const refreshList = () => {
    setIsFetching(true);
    dispatch(getBoardList());
  }


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
          onPress={() => setIsModalVisible(true)}
          style={{ marginEnd: Dimensions.get('window').width * 0.02 }}
        >
          <Entypo name="dots-three-vertical" size={22} color="#000000" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
         <TouchableOpacity 
            style={styles.container} 
            activeOpacity={1} 
            onPressOut={() => {setIsModalVisible(false)}}
          >
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={styles.modal}>
            <View style={styles.modalWrapper}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setIsModalVisible(false);
                  refreshList();
                }}
                style={{ flexDirection: 'row' }}
              >
                <Text style={styles.text}>새로고침</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalWrapper}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setIsModalVisible(false);
                  navigation.push('PostCreateScreen')
                }}
                style={{ flexDirection: 'row' }}
              >
                <Text style={styles.text}>글쓰기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      </Modal>
      <View style={styles.boardWrapper}>
        {boardList != '' ? (
          <FlatList
            data={boardList}
            renderItem={renderItem}
            keyExtractor={item => item.board_id}
            extraData={selectedId}
            onRefresh={refreshList}
            refreshing={isFetching}
          />
        ) : (
          <View style={{ width: Dimensions.get('window').width }}></View>
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
    modalWrapper: {
      marginVertical: Dimensions.get("window").height * 0.02,
  },
  modal: {
    marginTop: Dimensions.get('window').height * 0.01,
    marginLeft: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').height * 0.15,
    width: Dimensions.get('window').width * 0.47,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.00,
    elevation: 10,
},
container:{
  flex:1,
}
  
});

export default CommunityMainScreen;


