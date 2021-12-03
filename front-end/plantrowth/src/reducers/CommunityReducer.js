import {
  GET_BOARD_LIST,
  GET_POST,
  SAVE_POST,
  EDIT_POST,
  DELETE_POST,
  RESULT_STATE_POST,
  CREATE_COMMENT,
  RESULT_STATE_COMMENT,
  LIKE,
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from '../actions/type';

const initialState = {
  boardList: [],
  post: {},
  result: '',
  commentResult: '',
  likeResult: '',
};

function CommunityReducer(state = initialState, action) {
  switch (action.type) {
    case RESULT_STATE_POST:
      return { ...state, result: action.payload };
    case RESULT_STATE_COMMENT:
      return { ...state, commentResult: action.payload };
    case GET_BOARD_LIST:
      return { ...state, boardList: action.payload.reverse() };
    case GET_POST:
      return { ...state, post: action.payload };
    case SAVE_POST:
      return { ...state, result: action.payload };
    case EDIT_POST:
      return { ...state, result: action.payload };
    case DELETE_POST:
      return { ...state, result: action.payload };
    case CREATE_COMMENT:
      return { ...state, commentResult: action.payload };
    case UPDATE_COMMENT:
      return { ...state, commentResult: action.payload };
    case DELETE_COMMENT:
      return { ...state, commentResult: action.payload };
    case LIKE:
      return { ...state, likeResult: action.payload };
    default:
      return state;
  }
}

export default CommunityReducer;
