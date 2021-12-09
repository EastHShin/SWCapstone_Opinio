import { GET_HOME_INFO } from './type';
import axios from 'axios';

export const getHomeInfo = userId => {
  return async dispatch => {
    return axios
      .get(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/main/${userId}`,
        {
          headers: { 'content-Type': `application/json` },
        },
      )
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: GET_HOME_INFO,
            payload: res.data.data,
          });
        }
      })
      .catch(function (error) {
        console.warn('Home err:' + error);
      });
  };
};
