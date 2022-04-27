import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { userReducer, registerReducer, loginReducer } from './accounts/reducers'
import menuReducer from './menu/reducers'
import settingsReducer from './settings/reducers'

export default function rootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    accounts : combineReducers({
      user: userReducer,
      register: registerReducer,
      login: loginReducer
    }),
    menu: menuReducer,
    settings: settingsReducer,
  })
}
