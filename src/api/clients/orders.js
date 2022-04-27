import APIClient from 'api/clients/base';
import { buildUrl } from 'utils/api';

const paths = {
};

class OrderAPIClient {
  constructor() {
    this.client = new APIClient();
  }

}

export default new OrderAPIClient();
