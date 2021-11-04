import React, {useState, useEffect} from 'react';

import {
    ActivityIndicator,
    View,
    StyleSheet,
    Image
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as KakaoLogins from "@react-native-seoul/kakao-login";

const SplashScreen =({navigation}) =>{
    const [animating, setAnimating] = useState(true);

    useEffect(()=>{
        setTimeout(()=>{
            setAnimating(false);
            AsyncStorage.getItem('accessToken').then((value)=>
            navigation.replace(value === null ? 'LoginScreen':'HomeScreen'),
            );
        }, 5000);
    }, []);


    return(
        <View style ={styles.body}>
            <Image 
            source={require('./assets/plantrowth.png')}
            style = {{flex:1,width:'90%', resizeMode:'contain',margin:30}}/>
            
            <ActivityIndicator 
            style={styles.activityIndicator} 
            animating={animating}
            color ="#ffffff"
            size="large"
            />
        </View>
    )
}
export default SplashScreen;

const styles = StyleSheet.create({
    body:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#8EB695'
    },
    activityIndicator:{
        flex:1,
        alignItems:'center',
        height: 80,
    }
})


