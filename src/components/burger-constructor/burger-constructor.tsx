import React, {FC} from 'react';
import styles from './burger-constructor.module.scss';
import {Button, ConstructorElement, CurrencyIcon} from '@ya.praktikum/react-developer-burger-ui-components';
import {useDrop} from 'react-dnd';
import DraggableFilling from "../../hooks/useDraggableFilling";
import {Ingredient, SelectedIngredient} from "../../types";
import OrderDetails from "@components/ingredient-details/order-details";
import Modal from "@components/modal/modal";
import {useModal} from "../../hooks/useModal";


interface BurgerConstructorProps {
	selectedIngredients: SelectedIngredient[];
	onAddIngredient: (ingredient: Ingredient) => void;
	onRemoveIngredient: (index: number) => void;
	onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
}

const ItemTypes = {
	INGREDIENT: 'ingredient',
	FILLING: 'filling',
};


const BurgerConstructor: FC<BurgerConstructorProps> = ({
														   selectedIngredients = [],
														   onAddIngredient,
														   onRemoveIngredient,
														   onMoveIngredient
													   }) => {
	const { isModalOpen, openModal, closeModal } = useModal();
	// Разделение ингредиентов на булочки и начинки
	const buns = selectedIngredients.filter((item) => item.type === 'bun');
	const topBun = buns.length > 0 ? buns[0] : undefined;
	const bottomBun = buns.length > 1 ? buns[buns.length - 1] : topBun;
	const fillings = selectedIngredients.filter((item) => item.type !== 'bun');

	// Подсчет общей стоимости бургера
	const totalPrice = selectedIngredients.reduce((sum, item) => sum + item.price, 0);

	// Настройка drop-зоны для добавления ингредиентов
	const [, drop] = useDrop(() => ({
		accept: ItemTypes.INGREDIENT,
		drop: (item: Ingredient) => onAddIngredient(item),
	}));



	return (
		<section className={styles.burgerConstructor} ref={drop}>
			{/* Верхняя булочка */}
			{topBun && (
				<div className="mb-4">
					<ConstructorElement
						type="top"
						isLocked={true}
						text={`${topBun.name} (верх)`}
						price={topBun.price}
						thumbnail={topBun.image}
					/>
				</div>
			)}

			{/* Список начинок с поддержкой перетаскивания */}
			<ul className={`${styles.fillingsList} mb-4`}>
				{fillings.map((item, index) => (
					<DraggableFilling
						key={item.uniqueId}
						item={item}
						index={index}
						onMove={onMoveIngredient}
						onRemove={() => {
							const actualIndex = selectedIngredients.findIndex((i) => i.uniqueId === item.uniqueId);
							onRemoveIngredient(actualIndex);
						}}
					/>
				))}
			</ul>

			{/* Нижняя булочка */}
			{bottomBun && (
				<div className="mb-10">
					<ConstructorElement
						type="bottom"
						isLocked={true}
						text={`${bottomBun.name} (низ)`}
						price={bottomBun.price}
						thumbnail={bottomBun.image}
					/>
				</div>
			)}

			{/* Подвал с ценой и кнопкой оформления заказа */}
			<footer className={styles.footer}>
				<div className={`${styles.totalPrice} mr-10`}>
					<span className="text text_type_digits-medium mr-2">{totalPrice}</span>
					<CurrencyIcon type="primary"/>
				</div>
				<Button htmlType="button" type="primary" size="large" onClick={openModal}>
					Оформить заказ
				</Button>
			</footer>

			{/* Модальное окно с деталями заказа */}
			{isModalOpen && (
				<Modal onClose={closeModal}>
					<OrderDetails />
				</Modal>
			)}
		</section>
	);
};

export default BurgerConstructor;