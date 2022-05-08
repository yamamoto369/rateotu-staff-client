import APIClient from 'api/clients/base';
import { buildUrl } from 'utils/api';

const paths = {
  EMPLOYEE_DASHBOARD_DATA: 'employees/dashboard-data',
};

class EmployeeAPIClient {
  constructor() {
    this.client = new APIClient();
  }

  getDashboardData() {
    return this.client.get(buildUrl(paths.EMPLOYEE_DASHBOARD_DATA));
  }

}

export default new EmployeeAPIClient();
