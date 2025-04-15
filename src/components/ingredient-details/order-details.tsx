import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './order-details.module.scss';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';

interface OrderDetailsProps {
  order: {
    success: boolean;
    name: string;
    order: {
      number: number;
    };
  } | null;
}

const OrderDetails: FC<OrderDetailsProps> = ({ order }) => {
  const orderStatus = useSelector((state: RootState) => state.app.orderStatus);

  if (orderStatus === 'pending') {
    return (
      <div className={styles.container}>
        <div className={styles.loader}></div>
        <p className="text text_type_main-medium mt-8">Оформляем заказ...</p>
      </div>
    );
  }

  // Проверяем, что order существует, запрос завершился успешно, и orderStatus не 'failed'
  if (!order || !order.success || orderStatus !== 'succeeded') {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Ошибка при создании заказа</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className="text text_type_digits-large mb-8">{order.order.number}</p>
      <p className="text text_type_main-medium mb-15">Идентификатор заказа</p>
      <div className={styles.icon}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text text_type_main-default mt-15 mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;