import { GET_HOME_INFO } from "./type";
import axios from "axios";


export const getHomeInfo = (userId) => {
    return async dispatch => {
      console.log('HomeAction UserId: '+userId);
      return axios
        .get(
          //`https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/main/1`,
          `ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com/api/main/${userId}`,
          {
            headers: {'content-Type': `application/json`},
          },
        )
        .then(function (res) {
          if (res.status == 200) {
            //console.log('getHomeInfo 확인용: '+JSON.stringify(res));
            console.log('get homeInfo reducer: ' + JSON.stringify(res.data.data));
            dispatch({
              type: GET_HOME_INFO,
              payload: res.data.data,
            });
          }
        })
        .catch(function (error) {
          console.warn('Home err:'+error);
        });
    };
  };
  