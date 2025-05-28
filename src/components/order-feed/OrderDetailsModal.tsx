import React from 'react';
import { FeedOrder } from '../../features/feedSlice';
import { useAppSelector } from '../../store';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetailsModal.module.scss';

interface OrderDetailsModalProps {
  order?: FeedOrder | null;
  onClose: () => void;
}

const statusText: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
  cancelled: 'Отменён',
};

const statusClassMap: Record<string, string> = {
  done: styles.statusDone,
  cancelled: styles.statusCancelled,
  pending: styles.statusPending,
  created: styles.status,
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order }) => {
  const ingredients = useAppSelector((state) => state.app.ingredients);
  if (!order) {
    return <div>Заказ не найден или загружается...</div>;
  }
  // Сопоставляем ингредиенты заказа с объектами
  const orderIngredients = order.ingredients
    .map((id) => ingredients.find((item) => item._id === id))
    .filter(Boolean);

  // Группируем по id для подсчёта количества
  const ingredientCount: Record<string, number> = {};
  order.ingredients.forEach((id) => {
    ingredientCount[id] = (ingredientCount[id] || 0) + 1;
  });

  // Считаем сумму заказа
  const total = orderIngredients.reduce((sum, item) => sum + (item?.price || 0) * (ingredientCount[item!._id] || 1), 0);

  // Форматируем дату
  const date = new Date(order.createdAt);
  const timeString = date.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long' });

  // Статус
  const status = statusText[order.status] || order.status;
  const statusClass = statusClassMap[order.status] || styles.status;

  return (
    <div className={styles.container}>
      <h2 className={styles.number}>#{order.number}</h2>
      <h3 className={styles.name}>{order.name}</h3>
      <div className={statusClass}>{status}</div>
      <h4 className={styles.sectionTitle}>Состав:</h4>
      <ul className={styles.ingredientsList}>
        {Object.keys(ingredientCount).map((id) => {
          const item = ingredients.find((i) => i._id === id);
          if (!item) return null;
          return (
            <li className={styles.ingredientRow} key={id}>
              <img src={item.image} alt={item.name} className={styles.ingredientIcon} />
              <span className={styles.ingredientName}>{item.name}</span>
              <span className={styles.ingredientPrice}>{ingredientCount[id]} x {item.price}</span>
              <CurrencyIcon type="primary" />
            </li>
          );
        })}
      </ul>
      <div className={styles.footer}>
        <span className={styles.time}>{timeString}</span>
        <span className={styles.total}>{total} <CurrencyIcon type="primary" /></span>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 