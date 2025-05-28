import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { wsConnect, wsDisconnect } from '../../features/feedSlice';
import OrderCard from './OrderCard';
import FeedStats from './FeedStats';
import Modal from '../modal/modal';
import OrderDetailsModal from './OrderDetailsModal';
import styles from './OrderFeed.module.scss';
import { FeedOrder } from '../../features/feedSlice';

const OrderFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, wsConnected } = useAppSelector((state) => state.feed);
  const [selectedOrder, setSelectedOrder] = useState<FeedOrder | null>(null);

  useEffect(() => {
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  // Loader при загрузке заказов
  if (!wsConnected || orders.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p className="text text_type_main-medium">Загрузка заказов...</p>
      </div>
    );
  }

  // Разделяем заказы по статусу
  const done = orders.filter((o) => o.status === 'done').map((o) => o.number).slice(0, 10);
  const pending = orders.filter((o) => o.status === 'pending' || o.status === 'created').map((o) => o.number).slice(0, 10);

  const handleOrderClick = (order: FeedOrder) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className={styles.feedWrapper}>
      <section className={styles.feed}>
        <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
        <div className={styles.ordersList}>
          {orders.map((order: FeedOrder) => (
            <OrderCard key={order._id} order={order} onClick={handleOrderClick} />
          ))}
        </div>
      </section>
      <FeedStats total={total} totalToday={totalToday} done={done} pending={pending} />
      {selectedOrder && (
        <Modal onClose={handleCloseModal} title={`Детали заказа #${selectedOrder.number}`}>
          <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default OrderFeed; 