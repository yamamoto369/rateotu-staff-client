import React from 'react';
import { Table } from 'antd';

function OrderItemTable({ columns, dataSource, rowSelection, loading }) {
  return (
    <>
      <Table
        rowKey={(row) => row.id}
        className="utils__scrollTable"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: true }}
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        loading={loading}
      />
    </>
  );
}

export default OrderItemTable;
