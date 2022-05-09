import React from 'react';
import { Button, Input, message, Tooltip, Icon, notification } from 'antd';
import { connect } from 'react-redux';
import Loader from 'components/LayoutComponents/Loader';
import OrderAPIClient from 'api/clients/orders';
import OrderItemTable from 'components/RateotuComponents/OrderItemTable';
import moment from 'moment';
import camelcaseKeys from 'camelcase-keys';
import Highlighter from 'react-highlight-words';
import { renderPaymentStatusTag, renderItemTypeTag, renderOrderStatusTag } from 'utils/ui';
import styles from '../style.module.scss';

// TODO: Make it DRY

const mapStateToProps = (state) => {
  return {
    newOrderItems: state.ws.notifications.newOrderItems,
  };
};

@connect(mapStateToProps)
class DashboardBarman extends React.Component {
  state = {
    isLoading: {
      page: true,
      table: false,
    },
    selectedRowKeys: [],
    orders: [],
    workingOnTask: false,
    searchText: '',
    searchedColumn: '',
  };

  componentDidMount() {
    this.fetchOrderItems();
  };

  componentDidUpdate(prevProps) {
    // Wish I was able to use React hooks!!
    // _.isEqual - expensive
    if (this.props.newOrderItems.length !== prevProps.newOrderItems.length) {
      this.fetchOrderItems();
    }
  };

  fetchOrderItems = () => {
    const queryParams = {
      item_category: 'drink',
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

  getColumnSearchProps = (dataIndex, columnTitle) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${columnTitle}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  startPreparingSelectedDrinkItems = () => {
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
          message.success('The barman started preparing the selected drink items!', 5);
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

  finishPreparingSelectedDrinkItems = () => {
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
          message.success(
            'The barman has finished with the preparation of selected drink items!',
            5,
          );
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

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        ...this.getColumnSearchProps('id', 'ID'),
      },
      {
        title: 'Order ID',
        dataIndex: 'order.id',
        sorter: (a, b) => a.order.id - b.order.id,
      },
      {
        title: 'Table',
        dataIndex: 'table.tableNumber',
        filters: [
          { text: 'a1', value: 'a1' },
          { text: 'a2', value: 'a2' },
          { text: 'a3', value: 'a3' },
        ],
        onFilter: (value, row) => row.table.tableNumber === value,
        sorter: (a, b) => a.table.tableNumber.length - b.table.tableNumber.length,
      },
      {
        title: 'Name',
        dataIndex: 'item.name',
        sorter: (a, b) => a.item.name.length - b.item.name.length,
        render: (value) => `${value.substring(0, 15)}..`,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        sorter: (a, b) => a.quantity - b.quantity,
        ...this.getColumnSearchProps('quantity', 'Quantity'),
      },
      {
        title: 'Price',
        dataIndex: 'price',
        sorter: (a, b) => b.price - b.price,
        ...this.getColumnSearchProps('price', 'Price'),
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
            Order Status
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
        title: 'Payment Status',
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
        sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        render: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
      },
      {
        title: 'Updated',
        dataIndex: 'updatedAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
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

    if (isLoading.page) {
      return <Loader />;
    }

    return (
      <>
        <div className="utils__title utils__title--flat mb-3">
          <strong>Drinks to prepare</strong>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ marginBottom: 16 }}>
              <Button
                className="mr-2"
                type="primary"
                onClick={this.startPreparingSelectedDrinkItems}
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
                Prepare drinks
              </Button>
              <Button
                type="primary"
                onClick={this.finishPreparingSelectedDrinkItems}
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
                {hasSelected ? `Selected ${selectedRowKeys.length} drink items` : ''}
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

export default DashboardBarman;
