import { BUY_PROFILE_SLOT, GET_POINT, GET_MAX_PLANT_NUM, GET_SHOP_INFO } from "../actions/type";
let initialState = {
    point: '',
    maxPlantNumber: '',
    buyProfileSlotResult: '',
    shopInfo: {},
};

function ShopReducer(state = initialState, action) {
    switch (action.type) {
        case BUY_PROFILE_SLOT:
            return { ...state, buyProfileSlotResult: action.payload };
        case GET_POINT:
            return { ...state, point: action.payload };
        case GET_MAX_PLANT_NUM:
            return { ...state, maxPlantNumber: action.payload };
        case GET_SHOP_INFO:
            return { ...state, shopInfo: action.payload };
        default:
            return state;
    }
}

export default ShopReducer;