import React from 'react';
import { Tabs, Table } from 'antd';
import { Chart, Interval, Tooltip, Axis, Coordinate, Legend, Area, Line } from 'bizcharts';
import Loader from 'components/LayoutComponents/Loader';
import InfoCard from 'components/RateotuComponents/InfoCard';
import moment from 'moment';
import camelcaseKeys from 'camelcase-keys';
import EmployeeAPIClient from 'api/clients/employees';
import OrderAPIClient from 'api/clients/orders';
import TableAPIClient from 'api/clients/tables';
import {
  renderPaymentStatusTag,
  renderItemTypeTag,
  renderOrderStatusTag,
  renderDefaultBooleanStatusTag,
} from 'utils/ui';

const { TabPane } = Tabs;

class Dashboard extends React.Component {
  state = {
    isLoading: false,
    bestSellers: [],
    topCustomers: [],
    lastOrders: [],
    totalsPerDay: [],
    totalsPerCategory: [],
    totals: {},
    restaurantTables: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ isLoading: true });
    Promise.all([
      EmployeeAPIClient.getDashboardData(),
      OrderAPIClient.getOrderItems(),
      TableAPIClient.getTables(),
    ]).then((values) => {
      const camelCasedDashData = camelcaseKeys(values[0].data, { deep: true });
      const camelCasedOrderItemsData = camelcaseKeys(values[1].data, { deep: true });

      this.setState({
        isLoading: false,
        totalsPerDay: camelCasedDashData.orderItemTotals.quantityPerDay,
        totalsPerCategory: camelCasedDashData.orderItemTotals.quantityPerCategory,
        totals: camelCasedDashData.totals,
        bestSellers: camelCasedOrderItemsData,
        topCustomers: camelCasedOrderItemsData,
        lastOrders: camelCasedOrderItemsData,
        restaurantTables: camelcaseKeys(values[2].data, { deep: true }),
      });
    });
  };

  render() {
    const {
      isLoading,
      bestSellers,
      topCustomers,
      lastOrders,
      totalsPerDay,
      totalsPerCategory,
      totals,
      restaurantTables,
    } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    const bestSellersColumns = [
      {
        title: 'Name',
        dataIndex: 'item.name',
        sorter: (a, b) => a.item.name.length - b.item.name.length,
        render: (value) => `${value.substring(0, 15)}..`,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        defaultSortOrder: 'descend',
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
    ];

    const lastOrdersColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        width: '5%',
      },
      {
        title: 'Order ID',
        dataIndex: 'order.id',
        sorter: (a, b) => a.order.id - b.order.id,
        width: '8%',
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
        width: '8%',
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
        width: '7%',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        sorter: (a, b) => b.price - b.price,
        width: '6%',
      },
      {
        title: 'Category',
        dataIndex: 'item.category.name',
        sorter: (a, b) => a.item.category.name.length - b.item.category.name.length,
        render: (value) => renderItemTypeTag(value),
        width: '8%',
      },
      {
        title: 'Ord Status',
        dataIndex: 'orderStatus',
        filters: [
          { text: 'Created', value: 'created' },
          { text: 'Preparing', value: 'preparing' },
          { text: 'Ready', value: 'ready' },
          { text: 'Served', value: 'served' },
          { text: 'Serving', value: 'serving' },
          { text: 'Cancelled', value: 'cancelled' },
        ],
        onFilter: (value, row) => row.orderStatus === value,
        sorter: (a, b) => a.orderStatus.length - b.orderStatus.length,
        render: (value) => renderOrderStatusTag(value),
        width: '11%',
      },
      {
        title: 'Pymt Status',
        dataIndex: 'paymentStatus',
        filters: [
          { text: 'Pending', value: 'pending' },
          { text: 'Paid', value: 'paid' },
          { text: 'Not paid', value: 'not paid' },
        ],
        onFilter: (value, row) => row.paymentStatus === value,
        sorter: (a, b) => a.paymentStatus.length - b.paymentStatus.length,
        render: (value) => renderPaymentStatusTag(value),
        width: '12%',
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        render: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
      },
      {
        title: 'Customer',
        dataIndex: 'customer.username',
        sorter: (a, b) => a.customer.username.length - b.customer.username.length,
        width: '9%',
      },
    ];

    const customersColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: 'Customer',
        dataIndex: 'customer.username',
        sorter: (a, b) => a.customer.username.length - b.customer.username.length,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Total',
        dataIndex: 'total',
        sorter: (a, b) => b.total - b.total,
      },
    ];

    const restaurantTableColumns = [
      {
        title: 'Table Number',
        dataIndex: 'tableNumber',
      },
      {
        title: 'Avl Seat Cap',
        dataIndex: 'seatCapacity',
      },
      {
        title: 'Order Served',
        dataIndex: 'orderServed',
        render: (value) => renderDefaultBooleanStatusTag(value),
      },
    ];

    return (
      <div>
        <div className="utils__title utils__title--flat mb-3">
          <strong>RATEOTU Stats</strong>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-xl-9 col-lg-12">
                <div className="mb-5">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Total" key="1">
                      <Chart
                        height={300}
                        data={totalsPerDay}
                        scale={{
                          date: {
                            range: [0, 1],
                          },
                          orderItems: {
                            min: 0,
                            nice: true,
                          },
                        }}
                        autoFit
                      >
                        <Legend />
                        <Area position="date*orderItems" color="#089540" />
                        <Line
                          position="date*orderItems"
                          color="#089540"
                          tooltip={[
                            'date*orderItems',
                            (date, orderItems) => {
                              return {
                                title: 'Order Items',
                                name: date,
                                value: orderItems,
                              };
                            },
                          ]}
                        />
                        <Axis name="orderItems" title={{ visible: true, text: 'Order Items' }} />
                        <Tooltip showTitle position="top" showCrosshairs showMarkers />
                      </Chart>
                      <div className="row text-center">
                        <div className="col-lg-3 col-6">
                          <div className="mb-3">
                            <div className="font-size-16 mb-2">Orders</div>
                            <div className="font-size-20 text-black">
                              <strong>{totals.orders}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-6">
                          <div className="mb-3">
                            <div className="font-size-16 mb-2">Quantity</div>
                            <div className="font-size-20">
                              <strong>{totals.quantity}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-6">
                          <div className="mb-3">
                            <div className="font-size-16 mb-2">Customers</div>
                            <div className="font-size-20 text-black">
                              <strong>{totals.customers}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-6">
                          <div className="mb-3">
                            <div className="font-size-16 mb-2">Revenue</div>
                            <div className="font-size-20 text-black">
                              <strong>£ {totals.revenue}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
                <div>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Last Orders" key="1">
                      <Table
                        className="utils__scrollTable"
                        scroll={{ x: '100%' }}
                        columns={lastOrdersColumns}
                        dataSource={lastOrders}
                        rowKey={(row) => row.id}
                      />
                    </TabPane>
                    <TabPane tab="Best Sellers" key="2">
                      <Table
                        className="utils__scrollTable"
                        scroll={{ x: '100%' }}
                        columns={bestSellersColumns}
                        dataSource={bestSellers}
                        rowKey={(row) => row.id}
                      />
                    </TabPane>
                    <TabPane tab="Top Customers" key="3">
                      <Table
                        className="utils__scrollTable"
                        scroll={{ x: '100%' }}
                        columns={customersColumns}
                        dataSource={topCustomers}
                        rowKey={(row) => row.id}
                      />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
              <div className="col-xl-3 col-lg-12">
                <div className="row mb-5">
                  <div className="col-xl-12 col-lg-6 col-sm-12">
                    <Chart
                      height={480}
                      data={totalsPerCategory}
                      scale={{
                        percent: {
                          formatter: (val) => {
                            return `${val} %`;
                          },
                        },
                      }}
                      autoFit
                    >
                      <Coordinate type="theta" radius={0.75} />
                      <Tooltip showTitle={false} position="top" />
                      <Axis visible={false} />
                      <Interval
                        position="percent"
                        adjust="stack"
                        color={['category', ['#43a744', '#32cfcb']]}
                        style={{
                          lineWidth: 1,
                          stroke: '#fff',
                        }}
                        label={[
                          'count',
                          {
                            offset: -15,
                          },
                        ]}
                      />
                    </Chart>
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-xl-12 col-lg-6 col-sm-12">
                    <InfoCard title="LIFETIME SALES" value={totals.revenue} type="secondary" />
                  </div>
                  <div className="col-lg-12">
                    <div className="font-size-16 text-black mb-3">
                      <strong>RATEOTU Tables</strong>
                    </div>
                    <Table
                      className="utils__scrollTable"
                      scroll={{ x: '100%' }}
                      columns={restaurantTableColumns}
                      dataSource={restaurantTables}
                      pagination={false}
                      rowKey={(row) => row.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
