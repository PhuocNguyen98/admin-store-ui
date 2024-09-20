import { GET_STAFF, ADD_STAFF, EDIT_STAFF } from '../actionsType/staffActions';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STAFF:
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
      };
    case ADD_STAFF:
      return {
        ...state,
        data: [action.payload.data[0], ...state.data],
        isLoading: false,
      };
    case EDIT_STAFF: {
      console.log(action.payload);
      let newState = state.data.map((item) => {
        if (item.username === action.payload.staffUsername) {
          let staff = {
            username: action.payload.staffUsername,
            role_id: action.payload.staffRole,
          };
          return Object.assign(item, staff);
        }
        return item;
      });
      return { ...state, data: newState, isLoading: false };
    }
    default:
      return state;
  }
};

export default staffReducer;
