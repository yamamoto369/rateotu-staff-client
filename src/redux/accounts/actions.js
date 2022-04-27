// Action types
const actionTypes = {
  USER_REGISTER_REQUEST: 'USER/REGISTER_REQUEST',
  USER_REGISTER_SUCCESS: 'USER/REGISTER_SUCCESS',
  USER_REGISTER_FAILURE: 'USER/REGISTER_FAILURE',

  USER_LOGIN_REQUEST: 'USER/LOGIN_REQUEST',
  USER_LOGIN_SUCCESS: 'USER/LOGIN_SUCCESS',
  USER_LOGIN_FAILURE: 'USER/LOGIN_FAILURE',
  USER_LOGOUT: 'USER/LOGOUT',

  USER_LOAD_CURRENT_ACCOUNT: 'user/LOAD_CURRENT_ACCOUNT',
  USER_SET_STATE: 'USER/SET_STATE',
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
