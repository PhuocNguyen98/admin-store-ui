import { GET_USER } from '../actions/userActions';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return { ...state, data: action.payload, isLoading: false };
    default:
      return state;
  }
};

export default userReducer;
