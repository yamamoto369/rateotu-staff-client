import { LOCATION_CHANGE } from 'connected-react-router';
import actionTypes from './actions';

const initialState = {
  username: '',
  role: 'anonymous',
  email: '',
  avatar: '',
  authorized: false,
  loading: false,
}

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.USER_SET_STATE:
      return {...state, ...action.payload}
    default:
      return state
  }
}

const registerInitialState = {
  isLoading: false,
  successful: false,
  errors: {},
}

export function registerReducer(state = registerInitialState, action) {
  switch (action.type) {
    case actionTypes.USER_REGISTER_REQUEST:
      return {...state, ...action.payload}
    case actionTypes.USER_REGISTER_SUCCESS:
      return {...state, ...action.payload}
    case actionTypes.USER_REGISTER_FAILURE:
      return {...state, ...action.payload}
    default:
      return state
  }
}

const loginInitialState = {
  isLoading: false,
  successful: false,
  errors: {},
}

export function loginReducer(state = loginInitialState, action) {
  switch (action.type) {
    case actionTypes.USER_LOGIN_REQUEST:
      return {...state, ...action.payload}
    case actionTypes.USER_LOGIN_SUCCESS:
      return {...state, ...action.payload}
    case actionTypes.USER_LOGIN_FAILURE:
      return {...state, ...action.payload}
    case LOCATION_CHANGE:
      return {...state, errors: {}}
    default:
      return state
  }
}
