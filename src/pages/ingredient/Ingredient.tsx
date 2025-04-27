import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIngredients } from '../../features/appSlice';
import { AppDispatch, RootState } from '../../store';
import styles from './ingredient.module.scss';

export const Ingredient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { ingredients, ingredientsStatus, ingredientsError } = useSelector(
    (state: RootState) => state.app
  );

  useEffect(() => {
    if (ingredients.length === 0 && ingredientsStatus !== 'pending') {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients, ingredientsStatus]);

  useEffect(() => {
    if (ingredientsStatus === 'failed') {
      navigate('/');
    }
  }, [ingredientsStatus, navigate]);

  const ingredient = ingredients.find((item) => item._id === id);

  if (ingredientsStatus === 'pending') {
    return <div>Загрузка...</div>;
  }

  if (ingredientsError) {
    return <div className={styles.error}>Ошибка: {ingredientsError}</div>;
  }

  if (!ingredient) {
    return <div className={styles.error}>Ингредиент не найден</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className="text text_type_main-large mb-5">Детали ингредиента</h2>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={styles.image}
      />
      <h3 className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</h3>
      <div className={styles.details}>
        <div className={styles.detail}>
          <p className="text text_type_main-default text_color_inactive">Калории, ккал</p>
          <p className="text text_type_digits-default text_color_inactive">{ingredient.calories}</p>
        </div>
        <div className={styles.detail}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive">{ingredient.proteins}</p>
        </div>
        <div className={styles.detail}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive">{ingredient.fat}</p>
        </div>
        <div className={styles.detail}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive">{ingredient.carbohydrates}</p>
        </div>
      </div>
    </div>
  );
};