import React, {useState, useEffect} from 'react';

import {
    ActivityIndicator,
    View,
    StyleSheet,
    Image
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen =({navigation}) =>{
    const [animating, setAnimating] = useState(true);

    useEffect(()=>{
        setTimeout(()=>{
            setAnimating(false);
            AsyncStorage.getItem('accessTocken').then((value)=>
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
        backgroundColor:'#81C147'
    },
    activityIndicator:{
        flex:1,
        alignItems:'center',
        height: 80,
    }
})


