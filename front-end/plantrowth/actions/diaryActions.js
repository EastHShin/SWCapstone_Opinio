import { FETCH_DIARIES } from "./type";
import axios from "axios";


export const fetchDiaries = (plantId) =>  {

    return async dispatch =>{
        return await axios.get(`https://ddc5935c-e447-4f84-bb74-3549e177f250.mock.pstmn.io/diary/${plantId}`)
        .then(function(res){
            dispatch({
                type:FETCH_DIARIES,
                payload:res.data,
            })})
            .catch(function (error){
                console.log(error);
            })
        }
}