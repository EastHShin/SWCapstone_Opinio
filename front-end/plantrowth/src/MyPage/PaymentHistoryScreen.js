import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, StyleSheet, Text, Alert, Pressable, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPaymentHistory, refund } from '../actions/ShopActions';
import Loader from '../Loader';
import { useIsFocused } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const PaymentHistoryScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const isLogin = useSelector(state => state.UserReducer.isLogin);
	const isFocused = useIsFocused();
	const [loading, setLoading] = useState(false);
	const [userId, setUserId] = useState('');
	const paymentInfoList = useSelector(state => state.ShopReducer.paymentInfoList);

	useEffect(() => {
		if (isLogin == 'end') {
			navigation.reset({ routes: [{ name: "LoginScreen" }] });
		}
	}, [isLogin]);

	useEffect(() => {
		AsyncStorage.getItem('userId').then(value => {
			if (value != null) {
				setUserId(JSON.parse(value));
				console.log('결제 내역 userId: ' + userId);
				if (isFocused) {
					dispatch(getPaymentHistory(JSON.parse(value)));
					setLoading(false);
				}
			}
		});
	}, [isFocused]);

	const renderMerchant = (paymentInfoList) => {
		if (paymentInfoList !== null && paymentInfoList !== undefined) {
			return paymentInfoList
				? paymentInfoList.map((item, index) => {
					return (
						<View style={styles.merchantWrapper}>
							<View>
								<Text style={styles.merchantText}>결제 내역</Text>
							</View>
							<TouchableOpacity style={styles.refundButton} onPress={() => { dispatch(refund(item.merchant_uid)) }}>
								<Text style={styles.merchantText}>환불</Text>
							</TouchableOpacity>
						</View>
					)
				}) : null;
		}
	}


	return (
		<SafeAreaView style={styles.body}>
			<Loader loading={loading} />
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View style={styles.sectionWrapper}>
					<Text style={{ fontFamily: 'NanumGothicBold', fontSize: 18 }}>결제 내역</Text>
					{renderMerchant(paymentInfoList)}
					<View style={styles.merchantWrapper}>
						<View>
							<Text style={styles.merchantText}>결제 내역</Text>
						</View>
						<TouchableOpacity style={styles.refundButton}>
							<Text style={styles.merchantText}>환불 요청</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<Footer name={'My Page'} />
		</SafeAreaView>

	)
};



const styles = StyleSheet.create({
	sectionWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		width: screenWidth * 0.92,
		height: screenHeight * 0.83,
		backgroundColor: 'white',
		padding: 10,
		margin: 10,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,

		elevation: 7,
	},
	body: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	merchantWrapper: {
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'red',
		width: screenWidth * 0.85,
		height: screenHeight * 0.1,
		borderRadius: 15,
		margin: 5,
	},
	merchantText: {
		fontFamily: 'NanumGothic'
	},
	refundButton: {
		width: 70,
		height: 50,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		backgroundColor: '#93d07d',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,

		elevation: 2,
	}
})

export default PaymentHistoryScreen;