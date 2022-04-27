import APIClient from 'api/clients/base';
import { buildUrl } from 'utils/api';

const paths = {
  JWT_CREATE: 'accounts/auth/jwt/create/',
  USERS: 'accounts/users/',
  USER_ACTIVATE: 'accounts/users/activation/',
  USER_RESEND_ACTIVATION_EMAIL: 'accounts/users/resend_activation/',
  USER_CHANGE_PASSWORD: 'accounts/users/set_password/',
  USER_RESET_PASSWORD: 'accounts/users/reset_password/',
  USER_RESET_PASSWORD_CONFIRM: 'accounts/users/reset_password_confirm/',
}

class AccountAPIClient {
  constructor() {
    this.client = new APIClient();
  }

  createJWTTokens(requestBody) {
    return this.client.post(buildUrl(paths.JWT_CREATE), requestBody);
  }

  createUser(requestBody) {
    return this.client.post(buildUrl(paths.USERS), requestBody);
  }

  activateUser(requestBody) {
    return this.client.post(buildUrl(paths.USER_ACTIVATE), requestBody);
  }

  resendUserActivationEmail(requestBody) {
    return this.client.post(buildUrl(paths.USER_RESEND_ACTIVATION_EMAIL), requestBody);
  }

  changeUserPassword(requestBody) {
    return this.client.post(buildUrl(paths.USER_CHANGE_PASSWORD), requestBody);
  }

  resetUserPassword(requestBody) {
    return this.client.post(buildUrl(paths.USER_RESET_PASSWORD), requestBody);
  }

  resetUserPasswordConfirm(requestBody) {
    return this.client.post(buildUrl(paths.USER_RESET_PASSWORD_CONFIRM), requestBody);
  }
}

export default new AccountAPIClient();
