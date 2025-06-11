import React from 'react';
import styles from './OrderCard.module.scss';
import { FeedOrder } from '../../features/feedSlice';
import { useAppSelector } from '../../store';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

interface OrderCardProps {
  order: FeedOrder;
  onClick?: (order: FeedOrder) => void;
}

const statusText: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
  cancelled: 'Отменён',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const ingredients = useAppSelector((state) => state.app.ingredients);
  const orderIngredients = order.ingredients
    .map((id) => ingredients.find((item) => item._id === id))
    .filter(Boolean);

  // Считаем сумму заказа
  const total = orderIngredients.reduce((sum, item) => sum + (item?.price || 0), 0);

  // Для отображения максимум 6 иконок, остальные — +N
  const maxIcons = 6;
  const visibleIngredients = orderIngredients.slice(0, maxIcons);
  const restCount = orderIngredients.length - maxIcons;

  // Форматируем дату
  const date = new Date(order.createdAt);
  const timeString = date.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long' });

  // Статус
  const status = statusText[order.status] || order.status;
  const statusClass = order.status === 'done' ? styles.statusDone : order.status === 'cancelled' ? styles.statusCancelled : styles.status;

  return (
    <div className={styles.card} onClick={() => onClick && onClick(order)}>
      <div className={styles.header}>
        <span className={styles.number}>#{order.number}</span>
        <span className={styles.time}>{timeString}</span>
      </div>
      <div className={styles.name}>{order.name}</div>
      <div className={styles.statusRow}>
        <span className={statusClass}>{status}</span>
      </div>
      <div className={styles.ingredientsRow}>
        {visibleIngredients.map((item, idx) => (
          <div className={styles.ingredientIcon} key={idx} style={{ zIndex: maxIcons - idx }}>
            <img src={item?.image} alt={item?.name} />
            {idx === maxIcons - 1 && restCount > 0 && (
              <span className={styles.more}>+{restCount}</span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <span className={styles.price}>{total}</span>
        <CurrencyIcon type="primary" />
      </div>
    </div>
  );
};

export default OrderCard; 