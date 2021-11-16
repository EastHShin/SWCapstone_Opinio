import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Text,
    Dimensions,
    ScrollView,
    Modal,
    Alert
} from 'react-native';

import { fetchDiary } from '../actions/diaryActions';
import { useIsFocused } from '@react-navigation/native'
import Loader from '../Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { deleteDiary, setResultState } from '../actions/diaryActions';

const DiaryDetailScreen = ({ route, navigation }) => {

    const { selectedId, plantId, plantImg } = route.params;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const diary = useSelector(state => state.diaryReducer.diary);
    const result = useSelector(state => state.diaryReducer.result);

    useEffect(() => {
        if (isFocused) {
            dispatch(fetchDiary(selectedId));
        }
    }, [isFocused])

    useEffect(() => {
        if (result == 'success' && isFocused) {
            setLoading(false);
            dispatch(setResultState(''));
            setIsModalVisible(false);
            navigation.navigate('DiaryScreen', { plantId: plantId, plantImg: plantImg });
        }
        else if (result == 'failure' && isFocused) {
            setLoading(false);
            dispatch(setResultState(''));
            setIsModalVisible(false);
            alert('삭제 실패');
        }

    }, [result])

    const deleteMode = () => {
        Alert.alert(
            "삭제", "식물일기를 삭제하시겠습니까?", [
            {
                text: "취소",
                onPress: () => console.log("취소")

            },
            {
                text: "확인",
                onPress: () => {
                    setLoading(true);
                    dispatch(deleteDiary(selectedId))
                }
            }
        ]
        )

    }

    return (
        <SafeAreaView style={styles.body}>
            <Loader loading={loading} />
            <View style={{ marginVertical: "5%", marginEnd: "-80%" }}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setIsModalVisible(true)}>
                    <Entypo name='dots-three-vertical' size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        console.log("close");
                        setIsModalVisible(false);
                    }}
                >
                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                        <View style={styles.modal}>
                            <View style={styles.wrapper}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={deleteMode}
                                    style={{ flexDirection: "row" }}>
                                    <FontAwesome5 name='trash' size={20} color="#000000" style={styles.icon} />
                                    <Text style={styles.text}>삭제</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.wrapper}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        setIsModalVisible(false);
                                        navigation.navigate('DiaryEditScreen', { selectedId: selectedId, plnatId: plantId, plantImg: plantImg })
                                    }
                                    }
                                    style={{ flexDirection: "row" }}>
                                    <FontAwesome5 name='pen' size={25} color="#000000" style={styles.icon} />
                                    <Text style={styles.text}>수정</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View style={styles.diaryWrapper}>
                    <View style={styles.title}>
                        <Text style={{ color: "#000000", fontWeight: "bold" }}>{diary.title}</Text>
                    </View>

                    {diary.file_name ? (
                        <View>
                            <Image
                                source={{ uri: diary.file_name }}
                                style={{
                                    width: Dimensions.get('window').width * 0.8,
                                    height: Dimensions.get('window').height * 0.4,
                                    resizeMode: 'contain',
                                }}
                            />
                        </View>
                    ) : null}




                    <View style={styles.content}>
                        <Text style={{ color: "#000000" }}>
                            {diary.content}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View style={{
                marginBottom: Dimensions.get('window').height * 0.02,
                marginTop: Dimensions.get('window').height * 0.01
            }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>{diary.date}</Text>
            </View>
        </SafeAreaView>
    )
}
export default DiaryDetailScreen;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#8EB695",
        alignItems: 'center',
    },
    modal: {
        height: Dimensions.get('window').height * 0.25,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        flexDirection: "column",
        marginBottom: "-10%"

    },
    wrapper: {
        marginTop: Dimensions.get("window").height * 0.045
    },
    icon: {
        marginLeft: Dimensions.get("window").width * 0.05,
        marginRight: Dimensions.get("window").width * 0.05,

    },
    text: {
        fontSize: 15,
        color: "#000000"

    },
    diaryWrapper: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center"
    },
    title: {
        marginVertical: Dimensions.get("window").height * 0.03,
    },
    content: {
        marginVertical: Dimensions.get("window").height * 0.04,
        width: Dimensions.get('window').width * 0.8
    }

})