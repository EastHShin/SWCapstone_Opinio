import { REGISTER_USER} from "./type";

export function registerUser(data) {
    
    const req = fetch('https://ddc5935c-e447-4f84-bb74-3549e177f250.mock.pstmn.io/join',{
        method:'POST',
        body:data,
        headers:{
            'Content-Type': 'application/json',
        },
    }).then(res=>res.json());
    return { type: REGISTER_USER, payload: req }

}









