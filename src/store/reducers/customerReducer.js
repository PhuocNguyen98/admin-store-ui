import {
  GET_CUSTOMER,
  ADD_CUSTOMER,
  EDIT_CUSTOMER,
  DELETE_CUSTOMER,
} from '../actionsType/customerActions';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMER:
      return {
        ...state,
        data: action.payload.data,
        isLoading: false,
      };
    case ADD_CUSTOMER:
      return {
        ...state,
        data: [...state.data, action.payload],
        isLoading: false,
      };
    case EDIT_CUSTOMER: {
      const newState = state.data.map((item) => {
        // Ép kiểu dữ liệu( +action.payload.customerId) từ String thành Number
        if (item.customerId === +action.payload.customerId) {
          return Object.assign(item, action.payload);
        }
        return item;
      });
      return { ...state, data: newState, isLoading: false };
    }

    case DELETE_CUSTOMER: {
      const newState = state.data.filter(
        (item) => item.customerId !== action.payload,
      );
      return { ...state, data: newState, isLoading: false };
    }
    default:
      return state;
  }
};

export default customerReducer;
