import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { FEED_WS_ACTIONS } from '../../features/feedSlice';
import OrderCard from './OrderCard';
import FeedStats from './FeedStats';
import styles from './OrderFeed.module.scss';
import { FeedOrder } from '../../features/feedSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, total, totalToday, wsConnected } = useAppSelector((state) => state.feed);

  useEffect(() => {
    // Подключаемся только если нет активного подключения
    if (!wsConnected) {
      dispatch({ 
        type: FEED_WS_ACTIONS.connect, 
        payload: { 
          url: 'wss://norma.nomoreparties.space/orders/all'
        } 
      });
    }
    
    return () => {
      if (wsConnected) {
        dispatch({ type: FEED_WS_ACTIONS.disconnect });
      }
    };
  }, [dispatch, wsConnected]);

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
    navigate(`/feed/${order.number}`, { state: { background: location } });
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
    </div>
  );
};

export default OrderFeed; 