export const GET_STAFF = 'GET_STAFF';
export const ADD_STAFF = 'ADD_STAFF';
export const EDIT_STAFF = 'EDIT_STAFF';

export const fetchDataSuccess = (data) => ({
  type: GET_STAFF,
  payload: data,
});

export const fetchAddSuccess = (data) => ({
  type: ADD_STAFF,
  payload: data,
});

export const fetchEditSuccess = (data) => ({
  type: EDIT_STAFF,
  payload: data,
});
