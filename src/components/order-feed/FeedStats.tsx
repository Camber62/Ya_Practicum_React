import React from 'react';
import styles from './FeedStats.module.scss';

interface FeedStatsProps {
  total: number;
  totalToday: number;
  done: number[];
  pending: number[];
}

const FeedStats: React.FC<FeedStatsProps> = ({ total, totalToday, done, pending }) => {
  return (
    <section className={styles.stats}>
      <div className={styles.statuses}>
        <div>
          <h3 className={styles.title}>Готовы:</h3>
          <ul className={styles.listDone}>
            {done.map((num) => (
              <li key={num} className={styles.done}>{num}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={styles.title}>В работе:</h3>
          <ul className={styles.listPending}>
            {pending.map((num) => (
              <li key={num} className={styles.pending}>{num}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.totals}>
        <div>
          <h3 className={styles.title}>Выполнено за все время:</h3>
          <span className={styles.total}>{total.toLocaleString('ru-RU')}</span>
        </div>
        <div>
          <h3 className={styles.title}>Выполнено за сегодня:</h3>
          <span className={styles.totalToday}>{totalToday.toLocaleString('ru-RU')}</span>
        </div>
      </div>
    </section>
  );
};

export default FeedStats; 