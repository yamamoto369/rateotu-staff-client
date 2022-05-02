import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { userReducer, registerReducer, loginReducer } from './accounts/reducers'
import menuReducer from './menu/reducers'
import settingsReducer from './settings/reducers'
import wsReducer from './websockets/reducers'

export default function rootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    accounts: combineReducers({
      user: userReducer,
      register: registerReducer,
      login: loginReducer,
    }),
    menu: menuReducer,
    settings: settingsReducer,
    // Usually you have one ws connection for the whole app
    ws: wsReducer,
  });
}
