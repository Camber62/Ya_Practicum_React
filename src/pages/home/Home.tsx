import React from 'react';
import { useAppSelector } from '../../store';
import styles from './home.module.scss';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients';
import BurgerConstructor from '@components/burger-constructor/burger-constructor';

export const Home: React.FC = () => {
  const { ingredientsStatus, ingredientsError } = useAppSelector((state) => state.app);

  const isLoading = ingredientsStatus === 'pending';
  const error = ingredientsError;

  console.log('Rendering Home, status:', ingredientsStatus); // Для отладки

  return (
    <>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p className="text text_type_main-medium">Загрузка...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className="text text_type_main-medium text_color_error">{error}</p>
        </div>
      ) : (
        <main className={styles.main}>
          <section>
            <BurgerIngredients />
          </section>
          <section>
            <BurgerConstructor />
          </section>
        </main>
      )}
    </>
  );
};

export default Home;