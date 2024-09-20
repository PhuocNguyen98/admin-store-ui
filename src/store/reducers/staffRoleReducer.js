import { GET_STAFF_ROLE } from '../actionsType/staffRoleActions';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const staffRoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STAFF_ROLE:
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default staffRoleReducer;
