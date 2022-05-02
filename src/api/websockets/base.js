import ReconnectingWebSocket from 'reconnecting-websocket';
import { store as reduxStore } from 'index';
import camelcaseKeys from 'camelcase-keys';
import {
  wsConnected,
  wsConnecting,
  wsDisconnecting,
  wsDisconnected,
  wsMessageReceived,
} from 'redux/websockets/actions';
import { getAuthTokens } from 'utils/auth';

class WSClient {
  /**
   * JS Singleton for connecting to WebSockets.
   */
  static instance = null;

  static getInstance() {
    if (!WSClient.instance) {
      WSClient.instance = new WSClient();
    }
    return WSClient.instance;
  }

  constructor() {
    this._socketArgs = {
      connectionTimeout: 2000,
      maxRetries: 10,
    };
    this._path = this.constructor.getAbsoluteUrl;
    this._socket = null;
  }

  connect() {
    reduxStore.dispatch(wsConnecting());
    if (this._socket) {
      throw new Error('Socket connection already instantiated. Dispatch WS_DISCONNECT first!');
    } else {
      this._socket = new ReconnectingWebSocket(this._path, [], this._socketArgs);
      this.createEventListeners();
    }
  }

  disconnect() {
    reduxStore.dispatch(wsDisconnecting());
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    } else {
      throw new Error('Socket connection not instantiated. Dispatch WS_CONNECT first!');
    }
  }

  static async getAbsoluteUrl() {
    const accessToken = getAuthTokens().access;
    return `ws://127.0.0.1:8000/ws/employees/notifications?${accessToken}`;
  }

  createEventListeners() {
    this._socket.onopen = () => this.constructor.handleOpen();
    this._socket.onclose = () => this.constructor.handleClose();
    this._socket.onmessage = (event) => this.constructor.handleMessage(event);
    this._socket.onerror = (event) => this.constructor.handleError(event);
  }

  static handleOpen() {
    console.log('Connected to socket.');
    reduxStore.dispatch(wsConnected());
  }

  static handleClose() {
    console.log('Disconnected from the socket.');
    reduxStore.dispatch(wsDisconnected());
  }

  static handleMessage(event) {
    const parsedData = JSON.parse(event.data);
    reduxStore.dispatch(wsMessageReceived(camelcaseKeys(parsedData.payload)));
    console.log('Message received', JSON.parse(event.data));
  }

  static handleError(event) {
    console.log('Socket error', event);
  }

  static sendMessage() {
    // Maybe
  }
}

const wsClient = WSClient.getInstance();
export default wsClient;
