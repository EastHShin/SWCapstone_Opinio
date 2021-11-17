import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

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


const AccountInfoScreen = ({ navigation }) => {

 
    return (
        <View style={styles.body}>
         <Text>회원정보 조회 스크린</Text>
          <Footer />
        </View>
    )
};



const styles = StyleSheet.create({

    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default AccountInfoScreen;