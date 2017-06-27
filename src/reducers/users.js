const initalState = {
  users: [],
  loading: false,
  error: null
}

// REDUCER
function usersReducer(state=initalState, action) {
  let users;
  switch (action.type) {
    case 'FETCH_USER_PENDING':
      return {...state, loading: true };
      break;
    case 'FETCH_USER_FULFILLED':
      users = action.payload.data.results;
      return {...state, loading: false, users };
      break;
    case 'FETCH_USER_REJECTED':
      return {...state, loading: false, status: `${action.payload.message}` };
    default:
      return state;
  }
}

export default usersReducer;
