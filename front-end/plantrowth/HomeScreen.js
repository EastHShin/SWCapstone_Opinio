import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{useState, useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { logoutUser } from './src/actions/userActions';

import * as KakaoLogins from "@react-native-seoul/kakao-login";

import {
    View,
    StyleSheet,
    Text,
    Alert,
    TextInput,
    Pressable,
    Button
} from 'react-native';


//테스트용 스크린 !

function Home({navigation}) {

    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const isLogin = useSelector(state => state.userReducer.isLogin);

    useEffect(()=>{
        getData();
    },[]);

    useEffect(()=>{
        if(isLogin == 'end'){
            navigation.replace('LoginScreen');
        }
        
    },[isLogin])

    const getData = () =>{
        try {
            AsyncStorage.getItem('userId').then(value=>{
                if(value !=null) {  
    
                    setName(JSON.parse(value));
                  
                };
            })  
        } catch (error) {
            console.log(error);
            
        }
    }


    const unlinkKaka = async () =>{
        try {
            let result = await KakaoLogins.unlink();
            
            if(result){
                console.log('unlink');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onPressHandler = () =>{
        // unlinkKaka();
        dispatch(logoutUser());
    }

    return(
        <View style={styles.body}>
            <Text style = {styles.text}>
               Welcome {name}
            </Text>

            <CustomButton
             title = 'Logout'
             color = '#1eb900'
            onPressFunction={onPressHandler} />

            <Button title = "change" 
            onPress = {()=> navigation.push("DiaryScreen")}
            />
          
        </View>
    )
}

const CustomButton = (props) => {
    return (
        <Pressable
            onPress={props.onPressFunction}
            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            android_ripple={{ color: '#00000050' }}
            style={({ pressed }) => [
                { backgroundColor: pressed ? '#dddddd' : props.color },
                styles.button,
                { ...props.style }
            ]}
        >
            <Text style={styles.text}>
                {props.title}
            </Text>
        </Pressable>
    )

}
export default Home;

const styles = StyleSheet.create({

    body:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'

    },
    logo:{
        width:100,
        height:100,
        margin:20
    },
    text:{
        fontSize:30,
        color:'#ffffff'
    },
    input:{
        width:300,
        borderWidth:1,
        borderColor:'#555',
        borderRadius:10,
        backgroundColor:'#ffffff',
        textAlign:'center',
        fontSize:20,
        marginTop:130,
        marginBottom:10,

    },
    button: {
        width: 150,
        height: 50,
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },

})