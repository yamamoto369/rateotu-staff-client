import React from 'react';
import { Tag, Icon, Tooltip } from 'antd';

export function getLayout(pathname) {
  const nonAuthAccountsPaths = ['/accounts/settings'];

  if (pathname === '/') {
    return 'public';
  }
  if (/^\/accounts(?=\/|$)/i.test(pathname)) {
    if (!nonAuthAccountsPaths.includes(pathname)) {
      return 'login';
    }
  }
  return 'main';
}

export function getMenuItemTagStyle(type) {
  return type === 'FOOD'
    ? { color: '#fff', backgroundColor: '#43a744' }
    : { color: '#fff', backgroundColor: '#32cfcb' };
}

export function getPaymentStatusColor(status) {
  if (status === 'paid') return '#1acb38';
  if (status === 'pending') return '#b1b1b1';
  if (status === 'not paid') return '#f50a0a';
  return '#b4c3c1';
}

export function getPaymentStatusTagData(status) {
  return {
    status: status.toUpperCase(),
    color: getPaymentStatusColor(status),
  };
}

export function renderPaymentStatusTag(status) {
  const paymentStatusTag = getPaymentStatusTagData(status);
  return <Tag color={paymentStatusTag.color}>{paymentStatusTag.status}</Tag>;
}

export function getItemTypeTagColor(status) {
  if (status === 'food') return '#43a744';
  if (status === 'drink') return '#32cfcb';
  return '#b4c3c1';
}

export function getItemTypeTagData(status) {
  return {
    type: status.toUpperCase(),
    color: getItemTypeTagColor(status),
  };
}

export function renderItemTypeTag(type) {
  const itemTagData = getItemTypeTagData(type);
  return <Tag color={itemTagData.color}>{itemTagData.type}</Tag>;
}

export function renderOrderStatusTag(status) {
  if (status === 'created') {
    return (
      <Tooltip placement="top" title="Order created">
        <Tag color="#f50a0a">
          <Icon type="alert" />
        </Tag>
      </Tooltip>
    );
  }
  if (status === 'preparing' || status === 'serving') {
    return (
      <Tooltip
        placement="top"
        title={status === 'preparing' ? 'Order being prepared' : 'Order being served'}
      >
        <Tag color="#b1b1b1">
          <Icon type="sync" spin />
        </Tag>
      </Tooltip>
    );
  }
  if (status === 'ready') {
    return (
      <Tooltip placement="top" title="Order ready to be served">
        <Tag color="#ffad3c">
          <Icon type="bell" />
        </Tag>
      </Tooltip>
    );
  }
  if (status === 'cancelled') {
    return (
      <Tooltip placement="top" title="Order has been cancelled">
        <Tag color="#262422">
          <Icon type="stop" />
        </Tag>
      </Tooltip>
    );
  }
  if (status === 'served') {
    return (
      <Tooltip placement="top" title="Order was served">
        <Tag color="#1acb38">
          <Icon type="check" />
        </Tag>
      </Tooltip>
    );
  }
}

export function getNewOrderItemNotificationTitle(orderStatus) {
  if (orderStatus === 'created') return 'Order Item Created'
  if (orderStatus === 'ready') return 'Order Item Ready';
  return 'Notification Title'
}

export function renderDefaultBooleanStatusTag(value) {
  return value ? (
    <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
  ) : (
    <Icon type="close-circle" theme="twoTone" twoToneColor="#de4c4d" />
  );
}
