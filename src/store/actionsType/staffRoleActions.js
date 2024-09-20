export const GET_STAFF_ROLE = 'GET_STAFF_ROLE';

export const fetchDataSuccess = (data) => ({
  type: GET_STAFF_ROLE,
  payload: data,
});
