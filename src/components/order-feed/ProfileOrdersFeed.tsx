import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { wsConnect, wsDisconnect } from '../../features/profileOrdersSlice';
import OrderCard from './OrderCard';
import Modal from '../modal/modal';
import OrderDetailsModal from './OrderDetailsModal';
import styles from './OrderFeed.module.scss';
import { ProfileOrder } from '../../features/profileOrdersSlice';

const ProfileOrdersFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, wsConnected } = useAppSelector((state) => state.profileOrders);
  const [selectedOrder, setSelectedOrder] = useState<ProfileOrder | null>(null);

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

  const handleOrderClick = (order: ProfileOrder) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className={styles.feedWrapper}>
      <section className={styles.feed}>
        <h1 className="text text_type_main-large mb-5">История заказов</h1>
        <div className={styles.ordersList}>
          {orders.map((order: ProfileOrder) => (
            <OrderCard key={order._id} order={order} onClick={handleOrderClick} />
          ))}
        </div>
      </section>
      {selectedOrder && (
        <Modal onClose={handleCloseModal} title={`Детали заказа #${selectedOrder.number}`}>
          <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default ProfileOrdersFeed; 