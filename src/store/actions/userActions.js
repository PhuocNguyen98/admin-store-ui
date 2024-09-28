// Action types
export const GET_USER = 'GET_USER';

// Action creators
export const fetchDataSuccess = (data) => ({ type: 'GET_USER', payload: data });
