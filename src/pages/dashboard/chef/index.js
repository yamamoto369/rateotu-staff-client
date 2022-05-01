import React from 'react';
import { Button, message, Tooltip, Icon, notification } from 'antd';
import Loader from 'components/LayoutComponents/Loader';
import OrderAPIClient from 'api/clients/orders';
import OrderItemTable from 'components/RateotuComponents/OrderItemTable';
import moment from 'moment';
import camelcaseKeys from 'camelcase-keys';
import { renderPaymentStatusTag, renderItemTypeTag, renderOrderStatusTag } from 'utils/ui';
import styles from '../style.module.scss';

// TODO: Make it DRY

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Order ID',
    dataIndex: 'order.id',
    sorter: (a, b) => a.order.id - b.order.id,
  },
  {
    title: 'Name',
    dataIndex: 'item.name',
    sorter: (a, b) => a.item.name.length - b.item.name.length,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => b.price - b.price,
  },
  {
    title: 'Category',
    dataIndex: 'item.category.name',
    sorter: (a, b) => a.item.category.name.length - b.item.category.name.length,
    render: (value) => renderItemTypeTag(value),
  },
  {
    title: () => (
      <span className="d-inline-block">
        <Tooltip
          className="align-self-center mr-1"
          title="Showing only items with created and preparing order status."
        >
          <Icon type="info-circle" />
        </Tooltip>
        Order status
      </span>
    ),
    dataIndex: 'orderStatus',
    filters: [
      { text: 'Created', value: 'created' },
      { text: 'Preparing', value: 'preparing' },
    ],
    onFilter: (value, row) => row.orderStatus === value,
    sorter: (a, b) => a.orderStatus.length - b.orderStatus.length,
    render: (value) => renderOrderStatusTag(value),
  },
  {
    title: 'Payment status',
    dataIndex: 'paymentStatus',
    filters: [
      { text: 'Pending', value: 'pending' },
      { text: 'Paid', value: 'paid' },
      { text: 'Not paid', value: 'not paid' },
    ],
    onFilter: (value, row) => row.paymentStatus === value,
    sorter: (a, b) => a.paymentStatus.length - b.paymentStatus.length,
    render: (value) => renderPaymentStatusTag(value),
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    defaultSortOrder: 'descend',
    sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    render: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
  },
  {
    title: 'Image',
    dataIndex: 'item.imageUrl',
    render: (value) => (
      <a href="#" className={styles.thumbnail}>
        <img src={value} alt="" />
      </a>
    ),
  },
  {
    title: 'Customer',
    dataIndex: 'customer.username',
    sorter: (a, b) => a.customer.username.length - b.customer.username.length,
  },
];

class DashboardChef extends React.Component {
  state = {
    isLoading: {
      page: true,
      table: false,
    },
    selectedRowKeys: [],
    orders: [],
    workingOnTask: false,
  };

  componentDidMount() {
    this.fetchOrderItems();
  }

  fetchOrderItems = () => {
    const queryParams = {
      item_category: 'food',
      order_status: 'created,preparing',
    };
    OrderAPIClient.getOrderItems(queryParams).then((response) => {
      // Eslint complains, but not sure if worth to camelcase deep
      // recursively(perforamnce drop)
      const camelCasedData = camelcaseKeys(response.data, { deep: true });
      this.setState((state) => {
        return {
          orders: camelCasedData,
          isLoading: { ...state.isLoading, page: false },
          workingOnTask: camelCasedData.some((item) => item.orderStatus === 'preparing'),
          selectedRowKeys: [],
        };
      });
    });
  };

  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  startPreparingSelectedFoodItems = () => {
    const { selectedRowKeys } = this.state;

    this.setState((state) => {
      return {
        isLoading: { ...state.isLoading, table: true },
      };
    });

    const requestBody = {
      order_item_ids: selectedRowKeys,
      order_status: 'preparing',
    };

    OrderAPIClient.bulkUpdateOrderItemsOrderStatus(requestBody)
      .then((response) => {
        if (response.status === 200) {
          this.setState((state) => {
            return {
              workingOnTask: true,
              isLoading: { ...state.isLoading, table: false },
              errors: {},
            };
          }, this.fetchOrderItems);
          message.success('The chef started preparing the selected food items!', 5);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // For a debugging and demonstration purposes
          const errorData = error.response.data;
          for (const [key, value] of Object.entries(errorData)) {
            notification.error({
              message: key,
              description: value,
              duration: 10,
            });
          }
          this.setState((state) => {
            return {
              isLoading: { ...state.isLoading, table: false },
              errors: { ...error.response.data },
            };
          });
        }
      });
  };

  finishPreparingSelectedFoodItems = () => {
    const { selectedRowKeys } = this.state;

    this.setState((state) => {
      return {
        isLoading: { ...state.isLoading, table: true },
      };
    });

    const requestBody = {
      order_item_ids: selectedRowKeys,
      order_status: 'ready',
    };

    OrderAPIClient.bulkUpdateOrderItemsOrderStatus(requestBody)
      .then((response) => {
        if (response.status === 200) {
          this.setState((state) => {
            return {
              workingOnTask: false,
              isLoading: { ...state.isLoading, table: false },
              errors: {},
            };
          }, this.fetchOrderItems);
          message.success('The chef has finished with the preparation of selected food items!', 5);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // For a debugging and demonstration purposes
          const errorData = error.response.data;
          for (const [key, value] of Object.entries(errorData)) {
            notification.error({
              message: key,
              description: value,
              duration: 10,
            });
          }
          this.setState((state) => {
            return {
              isLoading: { ...state.isLoading, table: false },
              errors: { ...error.response.data },
            };
          });
        }
      });
  };

  render() {
    const { isLoading, selectedRowKeys, orders, workingOnTask } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    if (isLoading.page) {
      return <Loader />;
    }

    return (
      <>
        <div className="utils__title utils__title--flat mb-3">
          <strong>Food to prepare</strong>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ marginBottom: 16 }}>
              <Button
                className="mr-2"
                type="primary"
                onClick={this.startPreparingSelectedFoodItems}
                disabled={
                  !hasSelected ||
                  (workingOnTask &&
                    orders.some(
                      (item) =>
                        selectedRowKeys.includes(item.id) && item.orderStatus === 'preparing',
                    )) ||
                  (workingOnTask && !hasSelected)
                }
                loading={isLoading.table}
              >
                <i className={`${styles.menuIcon} far fa-cauldron mr-2`} />
                Prepare food
              </Button>
              <Button
                type="primary"
                onClick={this.finishPreparingSelectedFoodItems}
                disabled={
                  !workingOnTask ||
                  (workingOnTask &&
                    orders.some(
                      (item) => selectedRowKeys.includes(item.id) && item.orderStatus === 'created',
                    )) ||
                  (workingOnTask && !hasSelected)
                }
                loading={isLoading.table}
              >
                <i className={`${styles.menuIcon} far fa-check-square mr-2`} />
                Finish Task
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} food items` : ''}
              </span>
            </div>
            <OrderItemTable
              rowSelection={rowSelection}
              columns={columns}
              dataSource={orders}
              loading={isLoading.table}
            />
          </div>
        </div>
      </>
    );
  }
}

export default DashboardChef;
