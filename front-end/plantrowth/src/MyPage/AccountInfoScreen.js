import React, { useState, useEffect, useRef } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Alert,
    Pressable,
    Dimensions,
    TouchableOpacity,
    Animated,
    SafeAreaView,
    Button,
    Modal,
    Easing,
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { setUserInfoState, infoUser } from '../actions/UserActions';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountInfoScreen = ({ navigation }) => {

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const userInfo = useSelector(state=>state.UserReducer.userInfo);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (isFocused) {
            AsyncStorage.getItem('userId').then(value => {
                if (value != null) {
                    setUserId(JSON.stringify(value));  //
                    dispatch(infoUser(JSON.parse(value)));
                }
            }
            )
        }
        
    }, [isFocused])

    return (
        <SafeAreaView style={styles.body}>
         <View style={styles.top}>
        <TouchableOpacity
          style={{marginStart: Dimensions.get('window').width * 0.03}}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-sharp" size={23} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            marginEnd: Dimensions.get('window').width * 0.39,
            fontFamily: 'NanumGothicBold',
            color: '#000000',
          }}>
          회원정보 조회
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center',width:Dimensions.get('window').width,}}>
                        <View style={{ flex: 1, height: 1 ,backgroundColor: '#A9A9A9' }} />
                    </View>

      <View style={{flex: 1,justifyContent: 'space-between'}}>
      <View style={styles.wrapper}>
      <View style={styles.section}>
          <View style={styles.textWrapper}>
              <View style={styles.lineWrapper}>
          <Text style={styles.dot}>·  </Text>
          <Text style= {styles.smallText}>닉네임  :  {userInfo.user_name}</Text>
          </View>
          <View style={styles.lineWrapper}>
          <Text style={styles.dot}>·  </Text>
          <Text style= {styles.smallText}>이메일  :  {userInfo.email}</Text>
          </View>
          <View style={styles.lineWrapper}>
          <Text style={styles.dot}>·  </Text>
          <Text style= {styles.smallText}>생년월일  :  {userInfo.user_birth}</Text>
          </View>
          <View style={styles.lineWrapper}>
          <Text style={styles.dot}>·  </Text>
          <Text style= {styles.smallText}>최대 식물 프로필 수  :  {userInfo.maxPlantNum} 개</Text>
          </View>
          <View style={styles.lineWrapper}>
          <Text style={styles.dot}>·  </Text>
          <Text style= {styles.smallText}>현재 식물 프로필 수  :  {userInfo.plantNum} 개</Text>
          </View>
          <View style={styles.lineWrapper}>
          <Text style={styles.dot}>·  </Text>
          <Text style= {styles.smallText}>보유 중인 포인트  :  {userInfo.point}P</Text>
           </View>
           </View>
           </View>
          <Text style={{fontSize:12,marginStart:Dimensions.get('window').width*0.05, marginTop:Dimensions.get('window').height*0.02}}>회원정보를 수정하시려면 '수정' 버튼을 눌러주세요.</Text>
          <TouchableOpacity
              style={styles.smallButton}
              activeOpacity={0.5}
              onPress={()=> {
                navigation.push('PasswordCheckScreen',{userId :userId, userInfo:userInfo});
                // navigation.goBack();
              }
                }>
                <Text style={{
                  color: '#FFFFFF',
                  paddingVertical: 10, fontSize: 10,fontWeight:"bold"
                }}>수정</Text>
            </TouchableOpacity>
      </View>
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
        backgroundColor:"#C9E7BE"
    },
    top: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.06,
        width: Dimensions.get('window').width,
      },
      wrapper: {
        width: Dimensions.get('window').width,
      },
      section: {
      
        backgroundColor: "#FFFFFF",
        justifyContent:"center",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.3,
       
      
      },
  
      smallText:{
        fontSize:13,
        color:"#000000",
        marginTop:Dimensions.get('window').height*0.006,
      },
      textWrapper:{
        width:Dimensions.get('window').width*0.9,
        marginStart:Dimensions.get('window').width*0.08,
        marginBottom:Dimensions.get('window').height*0.02,
        marginTop:Dimensions.get('window').height*0.01,
      },
      dot:{
        fontSize:20, 
        fontWeight:"bold"
      },
      smallButton:{
        backgroundColor: '#82B594',
        height:Dimensions.get('window').height*0.05,
        marginTop:Dimensions.get('window').height*0.01,
        marginStart:Dimensions.get('window').width*0.75,
        width:Dimensions.get('window').width*0.2,
        alignItems: 'center',
        borderRadius: 20, 
    
      },
      lineWrapper:{
          flexDirection:'row'
      }
})

export default AccountInfoScreen;