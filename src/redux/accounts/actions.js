// Action types
const actionTypes = {
  USER_REGISTER_REQUEST: 'user/REGISTER_REQUEST',
  USER_REGISTER_SUCCESS: 'user/REGISTER_SUCCESS',
  USER_REGISTER_FAILURE: 'user/REGISTER_FAILURE',

  USER_LOGIN_REQUEST: 'user/LOGIN_REQUEST',
  USER_LOGIN_SUCCESS: 'user/LOGIN_SUCCESS',
  USER_LOGIN_FAILURE: 'user/LOGIN_FAILURE',
  USER_LOGOUT: 'user/LOGOUT',

  USER_LOAD_CURRENT_ACCOUNT: 'user/LOAD_CURRENT_ACCOUNT',
  USER_SET_STATE: 'user/SET_STATE',
};

// Actions
export const registerRequest = (credentials) => {
  return {
    type: actionTypes.USER_REGISTER_REQUEST,
    credentials,
    payload: {
      isLoading: true,
      successful: false,
      errors: {},
    }
  };
};

export const registerSuccess = () => {
  return {
    type: actionTypes.USER_REGISTER_SUCCESS,
    payload: {
      isLoading: false,
      successful: true,
      errors: {},
    }
  };
};

export const registerFailure = (error) => {
  return {
    type: actionTypes.USER_REGISTER_FAILURE,
    payload: {
      isLoading: false,
      successful: false,
      errors: error
    }
  };
};

export const loginRequest = (credentials) => {
  return {
    type: actionTypes.USER_LOGIN_REQUEST,
    credentials,
    payload: {
      isLoading: true,
      successful: false,
      errors: {},
    }
  };
};

export const loginSuccess = () => {
  return {
    type: actionTypes.USER_LOGIN_SUCCESS,
    payload: {
      isLoading: false,
      successful: true,
      errors: {},
    }
  };
};

export const loginFailure = (error) => {
  return {
    type: actionTypes.USER_LOGIN_FAILURE,
    payload: {
      isLoading: false,
      successful: false,
      errors: error
    }
  };
};

export const logout = () => {
  return {
    type: actionTypes.USER_LOGOUT,
  };
};

export const loadCurrentAccount = () => {
  return {
    type: actionTypes.USER_LOAD_CURRENT_ACCOUNT
  };
};

export default actionTypes;
