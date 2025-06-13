import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearConstructor, removeIngredientFromConstructor, moveIngredientInConstructor, addIngredientToConstructor } from '../../features/appSlice';
import { setAuthError } from '../../features/authSlice'; // Добавляем для установки ошибки
import styles from './burger-constructor.module.scss';
import { Button, ConstructorElement, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrop, useDragLayer } from 'react-dnd';
import DraggableFilling from '../../hooks/useDraggableFilling';
import { Ingredient } from '../../types';
import OrderDetails from '@components/ingredient-details/order-details';
import Modal from '@components/modal/modal';
import { useModal } from '../../hooks/useModal';

const ItemTypes = {
  INGREDIENT: 'ingredient',
  FILLING: 'filling',
};

const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { order, orderStatus, orderError, constructorData } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.auth);

  const { isModalOpen, openModal, closeModal } = useModal();

  // Формирование массива выбранных ингредиентов с учетом булок
  const selectedIngredients = constructorData.bun
    ? [constructorData.bun, ...constructorData.ingredients, constructorData.bun]
    : constructorData.ingredients;

  // Разделение ингредиентов на булки и начинки
  const buns = selectedIngredients.filter((item) => item.type === 'bun');
  const topBun = buns.length > 0 ? buns[0] : undefined;
  const bottomBun = buns.length > 1 ? buns[buns.length - 1] : topBun;
  const fillings = selectedIngredients.filter((item) => item.type !== 'bun');

  // Подсчет общей стоимости бургера
  const totalPrice = selectedIngredients.reduce((sum, item) => sum + item.price, 0);

  // Настройка drag-and-drop для добавления ингредиентов
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.INGREDIENT,
    drop: (item: Ingredient) => {
      const newIngredient = {
        ...item,
        uniqueId: `${item._id}-${Date.now()}`,
      };
      const isAlreadyAdded = constructorData.ingredients.some(
        (existingItem) => existingItem._id === newIngredient._id && existingItem.uniqueId === newIngredient.uniqueId
      );
      if (!isAlreadyAdded || item.type === 'bun') {
        dispatch(addIngredientToConstructor(newIngredient));
      }
    },
  }));

  // Хук useDragLayer для отслеживания перетаскивания
  const { isDragging, draggedItem } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    draggedItem: monitor.getItem() as Ingredient | null,
  }));

  const isDraggingBun = isDragging && draggedItem?.type === 'bun';
  const isDraggingFilling = isDragging && draggedItem?.type !== 'bun';

  const handleOrderClick = () => {
    // Проверяем, авторизован ли пользователь
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Получаем токен из localStorage
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      dispatch(setAuthError('Требуется авторизация'));
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Собираем ID ингредиентов для заказа
    const ingredientIds = selectedIngredients.map((item) => item._id);

    // Отправляем заказ
    dispatch(createOrder({ ingredients: ingredientIds, token: accessToken })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        openModal();
      } else if (result.meta.requestStatus === 'rejected') {
        if (result.payload === 'Требуется авторизация') {
          dispatch(setAuthError('Требуется авторизация'));
          navigate('/login', { state: { from: '/' } });
        }
      }
    });
  };

  const handleCloseModal = () => {
    if (orderStatus === 'succeeded') {
      dispatch(clearConstructor());
    }
    closeModal();
  };

  const handleRemoveIngredient = (index: number) => {
    if (index !== 0 && index !== selectedIngredients.length - 1) {
      const fillingIndex = index - 1;
      dispatch(removeIngredientFromConstructor(fillingIndex));
    }
  };

  const handleMoveIngredient = (dragIndex: number, hoverIndex: number) => {
    const fillingDragIndex = dragIndex - 1;
    const fillingHoverIndex = hoverIndex - 1;
    if (fillingDragIndex >= 0 && fillingHoverIndex >= 0) {
      dispatch(moveIngredientInConstructor({ dragIndex: fillingDragIndex, hoverIndex: fillingHoverIndex }));
    }
  };

  return (
    <section className={styles.burgerConstructor} ref={drop} data-testid="constructor-drop-target">
      {/* Верхняя булка или заглушка */}
      <div className="mb-4">
        {topBun ? (
          <div data-testid="constructor-bun">
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${topBun.name} (верх)`}
              price={topBun.price}
              thumbnail={topBun.image}
            />
          </div>
        ) : (
          <div
            className={`${styles.placeholder} ${styles.placeholderTop} ${
              isDraggingBun ? styles.placeholderActive : ''
            }`}
          >
            <p className="text text_type_main-default text_color_inactive">Выберите булки</p>
          </div>
        )}
      </div>

      {/* Начинки или заглушка */}
      <ul className={`${styles.fillingsList} mb-4`}>
        {fillings.length > 0 ? (
          fillings.map((item, index) => (
            <DraggableFilling
              key={item.uniqueId}
              item={item}
              index={index + 1}
              onMove={handleMoveIngredient}
              onRemove={() => {
                const actualIndex = selectedIngredients.findIndex((i) => i.uniqueId === item.uniqueId);
                handleRemoveIngredient(actualIndex);
              }}
            />
          ))
        ) : (
          <li
            className={`${styles.placeholder} ${
              isDraggingFilling ? styles.placeholderActive : ''
            }`}
          >
            <p className="text text_type_main-default text_color_inactive">Выберите начинку</p>
          </li>
        )}
      </ul>

      {/* Нижняя булка или заглушка */}
      <div className="mb-10 mt-4">
        {bottomBun ? (
          <div data-testid="constructor-bun">
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bottomBun.name} (низ)`}
              price={bottomBun.price}
              thumbnail={bottomBun.image}
            />
          </div>
        ) : (
          <div
            className={`${styles.placeholder} ${styles.placeholderBottom} ${
              isDraggingBun ? styles.placeholderActive : ''
            }`}
          >
            <p className="text text_type_main-default text_color_inactive">Выберите булки</p>
          </div>
        )}
      </div>

      {/* Футер с ценой и кнопкой оформления */}
      <footer className={styles.footer}>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOrderClick}
          disabled={orderStatus === 'pending' || !topBun}
          extraClass={styles.buttonWithLoader}
        >
          {orderStatus === 'pending' ? (
            <>
              <span className="text text_type_main-default mr-2">Оформление заказа</span>
              <span className={styles.loader}></span>
            </>
          ) : (
            'Оформить заказ'
          )}
        </Button>
      </footer>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails order={order} />
        </Modal>
      )}
      {orderError && (
        <p className={styles.error} data-testid="error-message">{orderError}</p>
      )}
    </section>
  );
};

export default BurgerConstructor;