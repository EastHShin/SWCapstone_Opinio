import { BUY_PROFILE_SLOT, GET_POINT, GET_MAX_PLANT_NUM, GET_SHOP_INFO } from './type';
import axios from 'axios';

export const getShopInfo = (userId) => {
  return async dispatch => {
    return await axios.get(
      `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/store/${userId}`
    ).then(function (response) {
      console.log('상점 response: ' + JSON.stringify(response.data));
      if (response.status === 200) {
        dispatch({ type: GET_SHOP_INFO, payload: response.data, });
      }
    }).catch(function (error) {
      console.warn('shop info 에러요~~~~~~~~~~~~');
      console.log(error);
    });
  }
}

export const buyProfileSlot = (userId) => {
  return async dispatch => {
    console.log('buy userId: ' + userId);
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/users/profiles/${userId}`,
      )
      .then(function (response) {
        console.log('slot 구매 response :', response);
        if (response.status === 200) {
          dispatch({ type: GET_MAX_PLANT_NUM, payload: response.data.data.max_plant_num });
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

export const sendBuyData = (userId, imp_uid, merchant_uid) => {
  return async dispatch => {
    console.log('결제 userId: ' + userId);
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/payments/complete/${userId}`,
        {
          imp_uid: imp_uid,
          merchant_uid: merchant_uid
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        console.log('slot 캐시 구매 response :', response);
        if (response.status === 200) {
          //dispatch({ type: GET_MAX_PLANT_NUM, payload: response.data.data.max_plant_num });
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

export const setBuyProfileSlotState = state => dispatch => {
  dispatch({
    type: BUY_PROFILE_SLOT,
    payload: state,
  });
};