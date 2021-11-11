export const getHomeInfo = () => {
    const userId = 1;
    return async dispatch => {
      return axios
        .get(
          //`https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/main/${userId}`,
          `http://ec2-3-37-194-56.ap-northeast-2.compute.amazonaws.com:8080/api/main/${userId}`,
          {
            headers: {'content-Type': `application/json`},
          },
        )
        .then(function (res) {
          //console.warn(res);
          if (res.status == 200) {
            console.log('get in reducer: ' + JSON.stringify(res.data.data));
            dispatch({
              type: GET_HOME_INFO,
              payload: res.data.data,
            });
            //console.warn(Store.getState());
          }
        })
        .catch(function (error) {
          console.warn(error);
        });
    };
  };
  