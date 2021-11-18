import React from 'react';
import {
  StyleSheet, 
  View, 
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView} from 'react-native';
import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
const CommunityMainScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'space-between',backgroundColor:"#FFFFFF"}}>
       <View style={styles.top}>
       
      </View>
      <Footer name={'Community'}/>
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

});

export default CommunityMainScreen;

