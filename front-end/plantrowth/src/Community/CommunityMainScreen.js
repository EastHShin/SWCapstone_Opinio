import React,{useState} from 'react';
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


const dataList = [
  {
    "id":1,
    "title":"안녕하세요!",
    "content":"반갑습니다~",
    "good":10,
    "comment":2,
    "date":"2021-11-05"
  },
  {
    "id":2,
    "title":"질문이 있습니다!",
    "content":"다육이는 물을 얼마나 줘야 할까요?",
    "good":3,
    "comment":10,
    "date":"2021-11-06"
  },
  {
    "id":3,
    "title":"식물 자랑합니다~",
    "content":"다들 제 식물 보고 가세요 !",
    "good":30,
    "comment":50,
    "date":"2021-11-07"
  },
  {
    "id":4,
    "title":"이 식물 아시는 분 ...",
    "content":"사진 속 식물 이름 아시는 분 있나요? 너무 궁금해요!",
    "good":5,
    "comment":8,
    "date":"2021-11-11"
  },

 
]

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
      <View style={{ alignItems: "flex-end", flexDirection:"row"}}>
      <Text style={styles.date}>{item.date}</Text>
        <MaterialCommunityIcons name='heart-outline' size = {14} color="#DC143C" style={{marginRight:Dimensions.get('window').width*0.01}}/>
        <Text style={{fontSize:10, color : "#DC143C", marginRight:Dimensions.get('window').width*0.02}}>{item.good}</Text>
        <SimpleLineIcons name = 'bubble' size ={14} color="#00BFFF" style={{marginRight:Dimensions.get('window').width*0.01}} />
        <Text style={{fontSize:10, color : "#00BFFF", marginRight:Dimensions.get('window').width*0.02}}>{item.comment}</Text>
      </View>
      
    </TouchableOpacity>
  );
}


const CommunityMainScreen = ({ navigation }) => {

  const [selectedId, setSelectedId] = useState("");


  const renderItem = ({ item }) => {

    return (
      <Item
        item={item}
        onPress={() => {

          console.log(item.id);
        }
        }
        style={{ backgroundColor: "#FFFFFF" }}
      />
    )
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: "#C9E7BE" }}>
      <View style={styles.top}>
        <TouchableOpacity
          style={{ marginStart: Dimensions.get('window').width * 0.03 }}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back-sharp' size={23} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => console.log("ddd")}>
          <Entypo name='dots-three-vertical' size={22} color="#000000" />
        </TouchableOpacity>
      </View>
      <View style={styles.diaryWrapper}>

      <FlatList
          data={dataList.reverse()}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      </View>
      <Footer name={'Community'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  top: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width
  },
  wrapper: {
    height: Dimensions.get('window').height * 0.82,
    width: Dimensions.get('window').width,
  },
  section: {
    marginBottom: Dimensions.get('window').height * 0.0009,
    backgroundColor: "#FFFFFF",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.07,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
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
  diaryWrapper: {
    height: Dimensions.get('window').height * 0.83,
    width: Dimensions.get('window').width,

  },
  item: {
    padding: 20,
    marginVertical: 5,
    // marginHorizontal: 16,
    borderRadius: 20,
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
    marginRight: Dimensions.get('window').width*0.55
  },




});

export default CommunityMainScreen;

