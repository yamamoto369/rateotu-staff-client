import { all, takeLatest, call, put, takeEvery} from 'redux-saga/effects';
import { notification } from 'antd';
import jwtDecode from 'jwt-decode';
import AccountAPIClient from 'api/clients/accounts';
import { history } from 'index';
import {
  setAuthTokens,
  removeAuthTokens,
  getAuthTokens,
  createEventListeners,
  deleteEventListeners
} from 'utils/auth';
import actionTypes, {
  registerFailure,
  registerSuccess,
  loginSuccess,
  loginFailure,
  loadCurrentAccount
} from './actions';


function* register({ credentials }) {
  try {
    yield call([AccountAPIClient, 'createUser'], credentials);
    yield put(registerSuccess());
    yield history.push({
      pathname: '/accounts/register/completed',
      state: { email: credentials.email }
    });
  } catch (e) {
    yield put(registerFailure(e.response.data));
  }
}

function* login({ credentials }) {
  try {
    const response = yield call([AccountAPIClient, 'createJWTTokens'], credentials);
    const { access, refresh } = response.data;
    yield setAuthTokens(access, refresh);
    yield put(loginSuccess());
    yield put(loadCurrentAccount());
    yield notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    })
  } catch (e) {
    yield put(loginFailure(e.response.data));
  }
}

function* setCurrentAccount() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  });
  try {
    const access = getAuthTokens().access;
    const decoded = jwtDecode(access);
    yield put({
      type: 'user/SET_STATE',
      payload: {
        username: decoded.username,
        email: decoded.email,
        role: decoded.employee_role || 'anonymous',
        authorized: true,
        loading: false,
      },
    });
    yield call(createEventListeners);
  } catch (e) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    });
  }
}

function* logout() {
  yield removeAuthTokens();
  yield put({
    type: 'user/SET_STATE',
    payload: {
      username: '',
      role: 'anonymous',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  });
  yield call(deleteEventListeners);
  yield history.push('/accounts/login');
}

export default function* userWatcherSaga() {
  yield all([
    takeLatest(actionTypes.USER_REGISTER_REQUEST, register),
    takeLatest(actionTypes.USER_LOGIN_REQUEST, login),
    takeLatest(actionTypes.USER_LOAD_CURRENT_ACCOUNT, setCurrentAccount),
    takeEvery(actionTypes.USER_LOGOUT, logout),
    setCurrentAccount()
  ])
}
