import React, { FC } from 'react';
import styles from './ingredient-card.module.scss';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import {Ingredient} from "../../types";


interface IngredientCardProps {
	ingredient: Ingredient;
	count: number;
	onClick: (ingredient: Ingredient) => void;
}

const ItemTypes = {
	INGREDIENT: 'ingredient',
};

const IngredientCard: FC<IngredientCardProps> = ({ ingredient, count, onClick }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.INGREDIENT,
		item: ingredient,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	return (
		<li
			className={`${styles.card} mb-8`}
			onClick={() => onClick(ingredient)}
			ref={drag}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			{count > 0 && (
				<Counter count={count} size="default" extraClass={styles.counter} />
			)}
			<img src={ingredient.image} alt={ingredient.name} className={styles.image} />
			<div className={`${styles.price} mt-1 mb-1`}>
				<span className="text text_type_digits-default mr-2">{ingredient.price}</span>
				<CurrencyIcon type="primary" />
			</div>
			<p className="text text_type_main-default">{ingredient.name}</p>
		</li>
	);
};

export default IngredientCard;