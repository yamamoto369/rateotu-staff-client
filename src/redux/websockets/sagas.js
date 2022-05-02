import React from 'react';
import { takeEvery, put } from 'redux-saga/effects';
import { notification } from 'antd';
import OrderItemNotificationDescription from 'components/RateotuComponents/OrderItemNotificationDescription';
import WSClient from 'api/websockets/base';
import { getNewOrderItemNotificationTitle } from 'utils/ui';
import actionTypes, { wsDisconnect } from './actions';

function* connect() {
  try {
    yield WSClient.connect();
  } catch (e) {
    console.log(e);
    yield put(wsDisconnect());
  }
}

function* messageReceived({ payload }) {
  try {
    yield notification.info({
      message: getNewOrderItemNotificationTitle(payload.orderStatus),
      description: (
        <OrderItemNotificationDescription
          type={payload.item.category.name}
          name={payload.item.name}
          updatedAt={payload.updatedAt}
          quantity={payload.quantity}
        />
      ),
      duration:6
    });
  } catch (e) {
    yield console.log(e);
  }
}

function* disconnect() {
  try {
    yield WSClient.disconnect();
  } catch (e) {
    console.log(e);
    yield put(wsDisconnect());
  }
}

export default function* wsWatcherSaga() {
  yield takeEvery(actionTypes.WS_CONNECT, connect);
  yield takeEvery(actionTypes.WS_MESSAGE_RECEIVED, messageReceived);
  yield takeEvery(actionTypes.WS_DISCONNECT, disconnect);
}
