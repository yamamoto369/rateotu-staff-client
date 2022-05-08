import axios from 'axios';
import { notification } from 'antd';
import { history, store as reduxStore } from 'index';
import { getAuthTokens, removeAuthTokens, setAuthTokens } from 'utils/auth';
import { getLayout } from 'utils/ui';
import settings  from 'config/settings';

const ACCOUNTS_AUTH_TOKEN_REFRESH_API_ENDPOINT = 'accounts/auth/jwt/refresh/';
const httpStatusCodeMessageMap = {
  500: 'Internal Server Error',
};

let isAlreadyRefreshingAccessToken = false;
let requestQueue = [];

function callRequestFromQueue(token) {
  requestQueue.map(request => request(token));
}

function addRequestToQueue(request) {
  requestQueue.push(request);
}

class APIClient {
  /**
   * Axios wrapper client:
   * 1. Adds an access token before each request
   * 2. On response checks if the token is expired:
   *  1. If expired, tries to refetch a new one:
   *    1. If the fetch was successful:
   *      1. Sets the new token in the authorization header
   *      2. Performs retransmission of each failed request
   *    2. If an error occurred:
   *      1. Removes the tokens from the local storage
   *      2. Resets the Redux state
   *      3. Redirects to the login page
   */
  constructor() {
    this.client = axios.create({
      baseURL: settings.BACKEND_API_BASE,
    })
    this.refeshClient = axios.create({
      baseURL: settings.BACKEND_API_BASE,
    })
    // Register axios interceptors to intercept requests or responses
    // before they are handled by axios
    this.setUpAxiosInterceptors()
  }

  setUpAxiosInterceptors() {
    this.client.interceptors.request.use(
      request => this.constructor.preRequestHandler(request),
      error => this.constructor.errorRequestHandler(error)
    )

    this.client.interceptors.response.use(
      response => this.constructor.successResponseHandler(response),
      error => this.errorResponseHandler(error)
    )
  }

  static preRequestHandler(request) {
    const accessToken = getAuthTokens().access;
    if (accessToken) {
      request.headers.authorization = `Bearer ${accessToken}`;
    }
    return request;
  }

  static errorRequestHandler(error) {
    return Promise.reject(error);
  }

  static successResponseHandler(response) {
    return response;
  }

  errorResponseHandler(error) {
    const { response } = error;
    const { status, config: { baseURL, url } } = response;
    const originalRequest = error.config;
    const refreshToken = getAuthTokens().refresh;
    const layout = getLayout(window.location.pathname);
    const errorMessage = httpStatusCodeMessageMap[status] || response.statusText;

    // Check if the request has failed (Unauthorized access) and the refresh token exists on the local storage
    if (status === 401 && refreshToken) {
      // Set the isAlreadyRefreshingAccessToken flag to true on the first failed request
      // and try to refetch a new access token
      if (!isAlreadyRefreshingAccessToken) {
        isAlreadyRefreshingAccessToken = true;
        // When promise resolves with a new token, run all queued up requests from the queue with the new token
        this.refreshAccessToken(refreshToken)
          .then(accessToken => {
            isAlreadyRefreshingAccessToken = false;
            callRequestFromQueue(accessToken);
            setAuthTokens(accessToken, undefined);
            requestQueue = []; // And reset the queue
          })
          // If an error occurs, forcibly log the user out
          .catch(() => {
            isAlreadyRefreshingAccessToken = false;
            requestQueue = [];
            this.constructor.forceLogout();
          });
      }
      // Create a new promise that will retry the failed request (with old config and a new access token)
      const retryRequest = new Promise(resolve => {
        addRequestToQueue(accessToken => {
          originalRequest.headers.authorization = `Bearer ${accessToken}`;
          resolve(this.client(originalRequest));
        });
      });

      return retryRequest;
    }

    if (status === 500 && layout === 'main') {
      notification.error({
        message: `500 - ${errorMessage} at:`,
        description: `${baseURL}${url}`,
        duration: 7.5,
      })
    }

    return Promise.reject(error);
  }

  async refreshAccessToken(refreshToken) {
    try {
      /**
       * If a refresh token is invalid (expired or intentionally changed on the client side),
       * Django server returns 401 in the response-
       */
      const response = await this.refeshClient.post(
        ACCOUNTS_AUTH_TOKEN_REFRESH_API_ENDPOINT,
        { refresh: refreshToken }
      );
      return response.data.access;
    } catch (error) {
      throw new Error(error);
    }
  }

  static forceLogout() {
    removeAuthTokens();
    reduxStore.dispatch({
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
    history.push('/accounts/login');
  }

  get(...args) {
    return this.client.get(...args);
  }

  post(...args) {
    return this.client.post(...args);
  }

  options(...args) {
    return this.client.options(...args);
  }

  put(...args) {
    return this.client.put(...args);
  }

  patch(...args) {
    return this.client.patch(...args);
  }

  delete(...args) {
    return this.client.delete(...args);
  }
}

export default APIClient;
