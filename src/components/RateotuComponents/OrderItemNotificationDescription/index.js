import React from 'react';
import moment from 'moment';
import { renderItemTypeTag } from 'utils/ui';
import style from './style.module.scss';

function OrderItemNotificationDescription({ type, updatedAt, name, quantity }) {
  return (
    <>
      <div className={style.head}>
        <p className={style.title}>
          Type:
          <strong className="text-black"> {renderItemTypeTag(type)}</strong>
        </p>
        <time className={style.time}>{moment(updatedAt).format('DD-MM-YYYY HH:mm:ss')}</time>
      </div>
      <div className={style.head}>
        <span className="mr-auto">
          Name: <strong className="text-black">{name}</strong>
        </span>
        <span>
          Quantity: <strong className="text-black">{quantity}x</strong>
        </span>
      </div>
    </>
  );
}

export default OrderItemNotificationDescription;
