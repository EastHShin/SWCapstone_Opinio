import React, { useState } from 'react';
/* 아임포트 결제모듈을 불러옵니다. */
import IMP from 'iamport-react-native';

/* 로딩 컴포넌트를 불러옵니다. */
import Loader from '../Loader';
import { useNavigation } from '@react-navigation/native';
import { sendBuyData } from '../actions/ShopActions';
import { useDispatch } from 'react-redux';

export function Payment({route}) {
    const dispatch = useDispatch();
  const navigation = useNavigation();
    /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
    function callback(response) {
        console.log(response);
        if(response.imp_success == 'true') {
            console.log('결제 성공'+route.params.userId);
            dispatch(sendBuyData(route.params.userId, response.imp_uid, response.merchant_uid));
        }
        //결제 post
    }

    /* [필수입력] 결제에 필요한 데이터를 입력합니다. */
    const data = {
        //pg: 'kakaopay'
        pg: 'inicis',
        pay_method: 'card',
        name: '프로필 슬롯',
        merchant_uid: `mid_${new Date().getTime()}`,
        amount: '100',
        buyer_email: route.params.email,
        buyer_name: route.params.name,
        //buyer_tel: '01048484651',
        //buyer_email: 'sudalasan@gmail.com',
        //buyer_addr: '수원시 장안구 연무동 220-9',
        //buyer_postcode: '16216',
        buyer_tel: route.params.phone,
        app_scheme: '1234'
    };

    return (
        <IMP.Payment
            userCode={'imp89463124'}  // 가맹점 식별코드
            loading={<Loader />} // 로딩 컴포넌트
            data={data}           // 결제 데이터
            callback={callback}   // 결제 종료 후 콜백
        />
    );
}

export default Payment;
