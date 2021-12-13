import {
  BUY_PROFILE_SLOT,
  GET_POINT,
  GET_MAX_PLANT_NUM,
  GET_SHOP_INFO,
  BUY_SUBSCRIBE,
  GET_PAYMENT_HISTORY,
  REFUND,
} from './type';
import axios from 'axios';

export const getShopInfo = userId => {
  return async dispatch => {
    return await axios
      .get(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/store/${userId}`,
      )
      .then(function (response) {
        console.log('상점 response: ' + JSON.stringify(response.data));
        if (response.status === 200) {
          dispatch({ type: GET_SHOP_INFO, payload: response.data });
        }
      })
      .catch(function (error) {
        console.warn('shop info 에러요~~~~~~~~~~~~');
        console.log(error);
      });
  };
};

export const buyProfileSlot = userId => {
  return async dispatch => {
    console.log('buy userId: ' + userId);
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/users/profiles/${userId}`,
      )
      .then(function (response) {
        console.log('slot 구매 response :', response);
        if (response.status === 200) {
          dispatch({
            type: GET_MAX_PLANT_NUM,
            payload: response.data.data.max_plant_num,
          });
          dispatch({ type: BUY_PROFILE_SLOT, payload: 'point' });
          dispatch({ type: GET_POINT, payload: response.data.data.point });
        }
      })
      .catch(function (error) {
        console.warn('slot 구매 에러요~~~~~~~~~~~~');
        dispatch({ type: BUY_PROFILE_SLOT, payload: 'failure' });
        console.log(error);
      });
  };
};

export const sendBuySlotData = (userId, imp_uid, merchant_uid) => {
  return async dispatch => {
    console.log('결제 userId: ' + userId);
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/payments/complete/slot`,
        {
          user_id: userId,
          imp_uid: imp_uid,
          merchant_uid: merchant_uid,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then(function (response) {
        console.log('slot 캐시 구매 response :', response);
        if (response.status === 200) {
          dispatch({
            type: GET_MAX_PLANT_NUM,
            payload: response.data.max_plant_num,
          });
          dispatch({ type: BUY_PROFILE_SLOT, payload: 'cash' });
        }
      })
      .catch(function (error) {
        console.warn('slot 캐시 구매 에러요~~~~~~~~~~~~');
        dispatch({ type: BUY_PROFILE_SLOT, payload: 'failure' });
        console.log(error);
      });
  };
};

export const sendBuySubscribeData = (userId, imp_uid, merchant_uid) => {
  console.log(userId + "  " + imp_uid + " " + merchant_uid);
  return async dispatch => {
    console.log('결제 userId: ' + userId);
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/payments/complete/diagnosis`,
        {
          user_id: userId,
          imp_uid: imp_uid,
          merchant_uid: merchant_uid,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then(function (response) {
        console.log('질병진단 구독 response :', response);
        if (response.status === 200) {
          console.log('질병진단 구독 response status 200');
          dispatch({ type: BUY_SUBSCRIBE, payload: 'success' });
        }
      })
      .catch(function (error) {
        console.warn('질병진단 구독 에러요~~~~~~~~~~~~');
        dispatch({ type: BUY_SUBSCRIBE, payload: 'failure' });
        console.log(error);
      });
  };
};

export const refund = (merchant_uid, cancel_request_amount, reason, userId) => {
  return async dispatch => {
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/payments/refund/${userId}`,
        {
          merchant_uid: merchant_uid,
          cancel_request_amount: cancel_request_amount,
          reason: reason,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then(function (response) {
        console.log('환불 response: ' + JSON.stringify(response));
        if (response.status === 200) {
          dispatch(setRefundState('success'));
        }
      })
      .catch(function (error) {
        if (error.response.status == 427) {
          dispatch(setRefundState('diagnosis'));
        } else {
          dispatch(setRefundState('failure'));
          console.log('환불 error: '+error);
        }
      });
  };
};
export const getPaymentHistory = userId => {
  return async dispatch => {
    return await axios
      .get(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/payments/record/${userId}`,
      )
      .then(function (response) {
        if (response.status === 200) {
          console.log('결제 내역: ' + JSON.stringify(response.data));
          dispatch({ type: GET_PAYMENT_HISTORY, payload: response.data });
        }
      })
      .catch(function (error) {
        console.warn('결제 내역 에러요~~~~~~~~~~~~');
        console.log(error);
      });
  };
};

export const setBuySubscribeState = state => dispatch => {
  dispatch({
    type: BUY_SUBSCRIBE,
    payload: state,
  });
};

export const setBuyProfileSlotState = state => dispatch => {
  dispatch({
    type: BUY_PROFILE_SLOT,
    payload: state,
  });
};

export const setRefundState = state => dispatch => {
  dispatch({
    type: REFUND,
    payload: state,
  });
};
