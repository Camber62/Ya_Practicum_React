import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { createOrder, clearConstructor } from '../../features/appSlice';
import styles from './burger-constructor.module.scss';
import { Button, ConstructorElement, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrop, useDragLayer } from 'react-dnd';
import DraggableFilling from '../../hooks/useDraggableFilling';
import { BurgerConstructorProps, Ingredient } from '../../types';
import OrderDetails from '@components/ingredient-details/order-details';
import Modal from '@components/modal/modal';
import { useModal } from '../../hooks/useModal';

const ItemTypes = {
	INGREDIENT: 'ingredient',
	FILLING: 'filling',
};

const BurgerConstructor: FC<BurgerConstructorProps> = ({
														   selectedIngredients,
														   onAddIngredient,
														   onRemoveIngredient,
														   onMoveIngredient,
													   }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { order, orderStatus } = useSelector((state: RootState) => state.app);
	const { isModalOpen, openModal, closeModal } = useModal();

	const buns = selectedIngredients.filter((item) => item.type === 'bun');
	const topBun = buns.length > 0 ? buns[0] : undefined;
	const bottomBun = buns.length > 1 ? buns[buns.length - 1] : topBun;
	const fillings = selectedIngredients.filter((item) => item.type !== 'bun');

	const totalPrice = selectedIngredients.reduce((sum, item) => sum + item.price, 0);

	// Хук useDrop для всей секции конструктора
	const [, drop] = useDrop(() => ({
		accept: ItemTypes.INGREDIENT,
		drop: (item: Ingredient) => {
			onAddIngredient(item);
		},
	}));

	// Хук useDragLayer для отслеживания перетаскивания
	const { isDragging, draggedItem } = useDragLayer((monitor) => ({
		isDragging: monitor.isDragging(),
		draggedItem: monitor.getItem() as Ingredient | null,
	}));

	// Определяем, является ли перетаскиваемый элемент булкой
	const isDraggingBun = isDragging && draggedItem?.type === 'bun';
	const isDraggingFilling = isDragging && draggedItem?.type !== 'bun';

	const handleOrderClick = () => {
		const ingredientIds = selectedIngredients.map(item => item._id);
		dispatch(createOrder(ingredientIds));
		openModal();
	};

	const handleCloseModal = () => {
		if (orderStatus === 'succeeded') {
			dispatch(clearConstructor());
		}
		closeModal();
	};

	return (
		<section className={styles.burgerConstructor} ref={drop}>
			{/* Верхняя булка или заглушка */}
			<div className="mb-4">
				{topBun ? (
					<ConstructorElement
						type="top"
						isLocked={true}
						text={`${topBun.name} (верх)`}
						price={topBun.price}
						thumbnail={topBun.image}
					/>
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
							onMove={onMoveIngredient}
							onRemove={() => {
								const actualIndex = selectedIngredients.findIndex((i) => i.uniqueId === item.uniqueId);
								onRemoveIngredient(actualIndex);
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
					<ConstructorElement
						type="bottom"
						isLocked={true}
						text={`${bottomBun.name} (низ)`}
						price={bottomBun.price}
						thumbnail={bottomBun.image}
					/>
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
				>
					{orderStatus === 'pending' ? 'Оформление...' : 'Оформить заказ'}
				</Button>
			</footer>

			{isModalOpen && (
				<Modal onClose={handleCloseModal}>
					<OrderDetails order={order} />
				</Modal>
			)}
		</section>
	);
};

export default BurgerConstructor;