import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    View,
    StyleSheet,
    Text,
    Alert,
    Modal,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkPassword, setCheckPasswordState } from '../actions/UserActions';
import Loader from '../Loader';


const PasswordCheckScreen = ({ route, navigation }) => {

    const { userId, userInfo } = route.params;
    const [userPassword, setUserPassword] = useState("");
    // const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const checkPasswordState = useSelector(state => state.UserReducer.checkPasswordState);

    useEffect(() => {

        if (checkPasswordState == "success" && isFocused) {
            setLoading(false);
            dispatch(setCheckPasswordState(''));
            navigation.navigate('AccountEditScreen', { userId: userId, userInfo: userInfo });
        }
        else if (checkPasswordState == "failure" && isFocused) {
            setLoading(false);
            dispatch(setCheckPasswordState(''));
            alert('비밀번호 인증에 실패했습니다. 비밀번호를 다시 확인해주세요.');
        }
    }, [checkPasswordState])

    const onPressHandler = () => {

        if (!userPassword) {
            alert('비밀번호를 입력해주세요!');
            return;
        }
        setLoading(true);

        dispatch(checkPassword(userId, userPassword));
    }

    return (
        <SafeAreaView style={styles.body}>
            <Loader loading={loading} />

            <View style={styles.top}>
                <TouchableOpacity
                    style={{ marginStart: Dimensions.get('window').width * 0.03 }}
                    activeOpacity={0.5}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name='chevron-back-sharp' size={23} color="#000000" />
                </TouchableOpacity>
                <Text
                    style={{
                        marginEnd: Dimensions.get('window').width * 0.39,
                        fontFamily: 'NanumGothicBold',
                        color: '#000000',
                    }}>
                    회원정보 수정
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <KeyboardAvoidingView enabled>
                    <View style={styles.wrapper}>
                        <View style={styles.section}>
                            <View style={{ flexDirection: "row", width: Dimensions.get('window').width * 0.65, marginStart: Dimensions.get('window').width * 0.04, alignItems: "center" }}>
                                <Text style={{ color: "#000000", fontSize: 15 }}> 비밀번호   :    </Text>
                                <TextInput
                                    style={styles.passwordInput}
                                    onChangeText={(UserPassword) =>
                                        setUserPassword(UserPassword)
                                    }
                                    underlineColorAndroid="#A9A9A9"
                                    placeholder="Enter Password"
                                    placeholderTextColor="#808080"
                                    secureTextEntry={true}
                                    onSubmitEditing={
                                        Keyboard.dismiss
                                    }
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>

                        <Text style={{ fontSize: 12, marginStart: Dimensions.get('window').width * 0.05, marginTop: Dimensions.get('window').height * 0.02 }}>회원정보 수정을 위해서는 비밀번호 인증이 필요합니다.</Text>
                        <TouchableOpacity
                            style={styles.smallButton}
                            activeOpacity={0.5}
                            onPress={onPressHandler
                            }>
                            <Text style={{
                                color: '#FFFFFF',
                                paddingVertical: 10, fontSize: 10, fontWeight: "bold"
                            }}>인증</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>



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
        backgroundColor: '#C9E7BE'
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
        marginBottom: Dimensions.get('window').height * 0.0009,
        backgroundColor: '#FFFFFF',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    smallButton: {
        backgroundColor: '#82B594',
        height: Dimensions.get('window').height * 0.05,
        marginTop: Dimensions.get('window').height * 0.01,
        marginStart: Dimensions.get('window').width * 0.75,
        width: Dimensions.get('window').width * 0.2,
        alignItems: 'center',
        borderRadius: 20,

    },
    passwordInput: {
        width: Dimensions.get('window').width * 0.5,
    },
    modalSectionWrapper:
    {
        backgroundColor: '#FFFFFF',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },

    button: {
        backgroundColor: '#BEE9B4',
        borderWidth: 0,
        height: Dimensions.get('window').height * 0.05,
        width: Dimensions.get('window').width * 0.25,
        marginTop: Dimensions.get('window').height * 0.09,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.00,
        elevation: 5
    },




})

export default PasswordCheckScreen;