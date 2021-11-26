import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, StyleSheet, Text, Alert, Modal, Dimensions, TouchableOpacity, SafeAreaView, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser, setUserDeleteState, setLogoutState } from '../actions/UserActions';
import Loader from '../Loader';

//UI 수정 필요!
const AccountDeleteScreen = ({ navigation }) => {

    const [userPassword, setUserPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const userDeleteState = useSelector(state => state.UserReducer.userDeleteState);

    useEffect(() => {
        if (isFocused) {
            AsyncStorage.getItem('userId').then(value => {
                if (value != null) {
                    setUserId(JSON.parse(value));
                }
            });
        }
    }, [isFocused])

    useEffect(() => {

        if (userDeleteState == "success" && isFocused) {
            setLoading(false);
            dispatch(setUserDeleteState(''));
            setIsModalVisible(true);
        }
        else if (userDeleteState == "failure" && isFocused) {
            setLoading(false);
            dispatch(setUserDeleteState(''));
            alert('회원탈퇴 실패! 비밀번호를 다시 확인해주세요.');
        }
    }, [userDeleteState])

    const onPressHandler = () => {

        if (!userPassword) {
            alert('비밀번호를 입력해주세요!');
            return;
        }

        Alert.alert('회원탈퇴', '정말 떠나실 건가요?', [
            {
                text: '취소',
                onPress: () => console.log('취소'),
            },
            {
                text: '확인',
                onPress: () => {
                    setLoading(true);
                    dispatch(deleteUser(userId, userPassword));
                },
            },
        ]);

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
                <Text style={{ marginEnd: Dimensions.get('window').width * 0.42, fontWeight: "bold", color: "#000000" }}>회원탈퇴</Text>
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


                        <TouchableOpacity
                            style={styles.smallButton}
                            activeOpacity={0.5}
                            onPress={onPressHandler
                            }>
                            <Text style={{
                                color: '#FFFFFF',
                                paddingVertical: 10, fontSize: 10, fontWeight: "bold"
                            }}>탈퇴</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>

                <Modal
                    transparent={true}
                    animationType={'none'}
                    onRequestClose={() => {
                        setIsModalVisible(false);
                        AsyncStorage.clear();
                    }}
                    visible={isModalVisible}
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <View style={styles.modalSectionWrapper}>

                            <Text style={{ color: "#000000" }}>그동안 Plantrowth를 이용해주셔서 감사합니다.</Text>
                            <Text style={{ color: "#000000" }}>다음에 또 만나요 !</Text>

                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.5}
                                onPress={() => {
                                    dispatch(setLogoutState('end'));
                                    AsyncStorage.clear();
                                    setIsModalVisible(false);
                                }
                                }>
                                <Text style={{ color: "#000000" }}>OK</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

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

export default AccountDeleteScreen;