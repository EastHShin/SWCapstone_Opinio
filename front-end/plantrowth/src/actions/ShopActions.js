import {BUY_PROFILE_SLOT, GET_POINT, GET_MAX_PLANT_NUM} from './type';
import axios from 'axios';

export const buyProfileSlot = userId => {
  return async dispatch => {
    console.log('buy userId: ' + userId);
    return await axios
      .put(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/users/profiles/${userId}`,
      )
      .then(function (response) {
        console.log('slot 구매 response :', response);
        if (response.status === 200) {
          dispatch({type: BUY_PROFILE_SLOT, payload: 'success'});
          dispatch({type: GET_POINT, payload: response.data.point});
          dispatch({type: GET_MAX_PLANT_NUM, payload: response.data.max_plant_num});
        }
      })
      .catch(function (error) {
        console.warn('slot 구매 에러요~~~~~~~~~~~~');
        dispatch({type: BUY_PROFILE_SLOT, payload: 'failure'});
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