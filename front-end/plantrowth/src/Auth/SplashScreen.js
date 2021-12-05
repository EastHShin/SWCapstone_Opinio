import React, { useState, useEffect } from 'react';

import {
    ActivityIndicator,
    StyleSheet,
    Image,
    SafeAreaView,
    Text
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SplashScreen = ({ navigation }) => {
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            AsyncStorage.getItem('email').then((value) => {
                if (value) {
                  AsyncStorage.getItem('plantId').then(value => {
                    if (!value) {
                      navigation.reset({ routes: [{ name: 'HomeScreen' }] });
                    } else {
                      navigation.reset({
                        routes: [
                          {
                            name: 'ManagePlantScreen',
                            params: { plantId: JSON.parse(value) },
                          },
                        ],
                      });
                      AsyncStorage.removeItem('plantId');
                    }
                  });

                  AsyncStorage.getItem('auth').then(value => {
                    axios.defaults.headers.common['X-AUTH-TOKEN'] = value;
                  });
                } else {
                  navigation.reset({ routes: [{ name: 'LoginScreen' }] });
                }
            }
            );
        }, 5000);
    }, []);

    return (
        <SafeAreaView style={styles.body}>
            <Image
                source={require('../assets/plantrowth.png')}
                style={{ flex: 1, width: '90%', resizeMode: 'contain', margin: 30 }} />
            <Text style={{ color: "#FFFFFF", fontSize: 30, fontFamily: 'NanumGothicBold' }}>Plantrowth</Text>

            <ActivityIndicator
                style={styles.activityIndicator}
                animating={animating}
                color="#ffffff"
                size="large"
            />
        </SafeAreaView>
    )

}
export default SplashScreen;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8EB695'
    },
    activityIndicator: {
        flex: 1,
        alignItems: 'center',
        height: 80,
    }
})


