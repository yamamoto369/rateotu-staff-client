import APIClient from 'api/clients/base';
import { buildUrl } from 'utils/api';

const paths = {
  TABLES: 'tables',
};

class TableAPIClient {
  constructor() {
    this.client = new APIClient();
  }

  getTables() {
    return this.client.get(buildUrl(paths.TABLES));
  }
}

export default new TableAPIClient();
