export const GET_CUSTOMER = 'GET_CUSTOMER';
export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const EDIT_CUSTOMER = 'EDIT_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';

export const fetchDataSuccess = (data) => ({
  type: GET_CUSTOMER,
  payload: data,
});

export const fetchAddSuccess = (data) => ({
  type: ADD_CUSTOMER,
  payload: data,
});

export const fetchEditSuccess = (data) => ({
  type: EDIT_CUSTOMER,
  payload: data,
});

export const fetchDeleteSuccess = (data) => ({
  type: DELETE_CUSTOMER,
  payload: data,
});
