import React from 'react';
import styles from './OrderDetailsModal.module.scss';

const OrderDetailsSkeleton: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.number} style={{ background: '#22223a', height: 32, width: 120, borderRadius: 8, marginBottom: 8 }} />
    <div className={styles.name} style={{ background: '#22223a', height: 28, width: 220, borderRadius: 8, marginBottom: 8 }} />
    <div className={styles.status} style={{ background: '#22223a', height: 20, width: 100, borderRadius: 8, marginBottom: 16 }} />
    <div className={styles.sectionTitle} style={{ background: '#22223a', height: 20, width: 80, borderRadius: 8, margin: '24px 0 12px 0' }} />
    <ul className={styles.ingredientsList}>
      {[1,2,3,4].map((_, i) => (
        <li className={styles.ingredientRow} key={i}>
          <div className={styles.ingredientIcon} style={{ background: '#22223a' }} />
          <div className={styles.ingredientName} style={{ background: '#22223a', height: 20, width: 120, borderRadius: 8 }} />
          <div className={styles.ingredientPrice} style={{ background: '#22223a', height: 20, width: 60, borderRadius: 8 }} />
        </li>
      ))}
    </ul>
    <div className={styles.footer}>
      <div className={styles.time} style={{ background: '#22223a', height: 18, width: 100, borderRadius: 8 }} />
      <div className={styles.total} style={{ background: '#22223a', height: 28, width: 80, borderRadius: 8 }} />
    </div>
  </div>
);

export default OrderDetailsSkeleton; 