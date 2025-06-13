import React, { FC } from 'react';
import styles from './ingredient-card.module.scss';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { Ingredient } from '../../types';

// Интерфейс пропсов для карточки ингредиента
interface IngredientCardProps {
	ingredient: Ingredient;
	count: number;
	onClick: (ingredient: Ingredient) => void;
	onAdd?: (ingredient: Ingredient) => void;
}

// Константы для типов drag-and-drop
const ItemTypes = {
	INGREDIENT: 'ingredient',
};

// Компонент карточки ингредиента
const IngredientCard: FC<IngredientCardProps> = ({ ingredient, count, onClick }) => {
	// Хук useDrag для поддержки перетаскивания ингредиента
	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.INGREDIENT,
		item: ingredient,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	// Рендеринг карточки ингредиента
	return (
		<li
			data-testid="ingredient-item"
			className={`${styles.card} mb-8`}
			onClick={() => onClick(ingredient)}
			ref={drag}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			{/* Счётчик количества ингредиента в конструкторе */}
			{count > 0 && (
				<Counter count={count} size="default" extraClass={styles.counter} />
			)}
			{/* Изображение ингредиента */}
			<img src={ingredient.image} alt={ingredient.name} className={styles.image} />
			{/* Цена ингредиента */}
			<div className={`${styles.price} mt-1 mb-1`}>
				<span className="text text_type_digits-default mr-2">{ingredient.price}</span>
				<CurrencyIcon type="primary" />
			</div>
			{/* Название ингредиента */}
			<p className="text text_type_main-default">{ingredient.name}</p>
		</li>
	);
};

export default IngredientCard;