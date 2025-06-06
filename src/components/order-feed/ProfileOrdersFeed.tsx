import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { PROFILE_ORDERS_WS_ACTIONS } from '../../features/profileOrdersSlice';
import OrderCard from './OrderCard';
import styles from './OrderFeed.module.scss';
import { ProfileOrder } from '../../features/profileOrdersSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileOrdersFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, wsConnected } = useAppSelector((state) => state.profileOrders);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // Подключаемся только если нет активного подключения и есть токен
    if (!wsConnected && token) {
      dispatch({ 
        type: PROFILE_ORDERS_WS_ACTIONS.connect, 
        payload: { 
          url: 'wss://norma.nomoreparties.space/orders',
          token: token.replace('Bearer ', '')
        } 
      });
    }
    
    return () => {
      if (wsConnected) {
        dispatch({ type: PROFILE_ORDERS_WS_ACTIONS.disconnect });
      }
    };
  }, [dispatch, token, wsConnected]);

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
    navigate(`/profile/orders/${order.number}`, { state: { background: location } });
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
    </div>
  );
};

export default ProfileOrdersFeed; 