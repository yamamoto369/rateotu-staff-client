import actionTypes from './actions';

const initialState = {
  connected: false,
  notifications: {
    newOrderItems: []
  },
};

export default function wsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.WS_CONNECT:
    case actionTypes.WS_CONNECTING:
    case actionTypes.WS_CONNECTED:
    case actionTypes.WS_DISCONNECT:
    case actionTypes.WS_DISCONNECTING:
      return { ...state, ...action.payload };
    case actionTypes.WS_DISCONNECTED:
      return { ...state, ...action.payload, notifications: { newOrderItems: [] } };
    case actionTypes.WS_MESSAGE_RECEIVED:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          newOrderItems: [...state.notifications.newOrderItems, action.payload],
        },
      };
    default:
      return state;
  }
}
