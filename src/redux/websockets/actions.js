const actionTypes = {
  WS_CONNECT: 'ws/SOCKETS_CONNECT',
  WS_CONNECTING: 'ws/SOCKETS_CONNECTING',
  WS_CONNECTED: 'ws/SOCKETS_CONNECTED',
  WS_DISCONNECT: 'ws/SOCKETS_DISCONNECT',
  WS_DISCONNECTING: 'ws/SOCKETS_DISCONNECTING',
  WS_DISCONNECTED: 'ws/SOCKETS_DISCONNECTED',
  WS_MESSAGE_SEND: 'ws/SOCKETS_MESSAGE_SEND',
  WS_MESSAGE_RECEIVED: 'ws/SOCKETS_MESSAGE_RECEIVED',
};

export const wsConnect = () => {
  return {
    type: actionTypes.WS_CONNECT,
    payload: {
      connected: false,
    },
  };
};

export const wsConnecting = () => {
  return {
    type: actionTypes.WS_CONNECTING,
    payload: {
      connected: false,
    },
  };
};

export const wsConnected = () => {
  return {
    type: actionTypes.WS_CONNECTED,
    payload: {
      connected: true,
    },
  };
};

export const wsDisconnect = () => {
  return {
    type: actionTypes.WS_DISCONNECT,
    payload: {
      connected: false,
    },
  };
};

export const wsDisconnecting = () => {
  return {
    type: actionTypes.WS_DISCONNECTING,
    payload: {
      connected: false,
    },
  };
};

export const wsDisconnected = () => {
  return {
    type: actionTypes.WS_DISCONNECTED,
    payload: {
      connected: false,
    },
  };
};

export const wsMessageSend = (data) => {
  return {
    type: actionTypes.WS_MESSAGE_SEND,
    payload: data,
  };
};

export const wsMessageReceived = (data) => {
  return {
    type: actionTypes.WS_MESSAGE_RECEIVED,
    payload: data,
  };
};


export default actionTypes;
