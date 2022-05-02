import { all } from 'redux-saga/effects'
import userWatcherSaga from './accounts/sagas'
import menuWatcherSaga from './menu/sagas'
import settingsWatcherSaga from './settings/sagas'
import wsWatcherSaga from './websockets/sagas';

export default function* rootSaga() {
  yield all([userWatcherSaga(), menuWatcherSaga(), settingsWatcherSaga(),  wsWatcherSaga()])
}
