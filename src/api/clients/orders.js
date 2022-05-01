import APIClient from 'api/clients/base';
import { buildUrl } from 'utils/api';

const paths = {
  ORDERS: 'orders',
  ORDER_ITEMS: 'orders/items',
  ORDER_ITEM: 'orders/items/:id',
  ORDER_ITEMS_BULK_UPDATE: 'orders/items/bulk-update',
};

class OrderAPIClient {
  constructor() {
    this.client = new APIClient();
  }

  getOrders(queryParams = {}) {
    return this.client.get(buildUrl(paths.ORDERS, { queryParams }));
  }

  getOrderItems(queryParams = {}) {
    return this.client.get(buildUrl(paths.ORDER_ITEMS, { queryParams }));
  }

  partialyOrderItem(pathParams, requestBody) {
    return this.client.patch(buildUrl(paths.ORDER_ITEM, { pathParams }), requestBody);
  }

  bulkUpdateOrderItemsOrderStatus(requestBody) {
    return this.client.patch(buildUrl(paths.ORDER_ITEMS_BULK_UPDATE), requestBody);
  }
}

export default new OrderAPIClient();
