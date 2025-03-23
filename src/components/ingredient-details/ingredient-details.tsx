import React, { FC } from 'react';
import styles from './ingredient-details.module.scss';
import {IngredientDetailsProps} from "../../types";


const IngredientDetails: FC<IngredientDetailsProps> = ({ ingredient }) => {
	return (
		<div className={styles.container}>
			<img src={ingredient.image_large} alt={ingredient.name} className={styles.image} />
			<h3 className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</h3>
			<div className={styles.nutrients}>
				<div className={styles.nutrient}>
					<p className="text text_type_main-default text_color_inactive">Калории, ккал</p>
					<p className="text text_type_digits-default text_color_inactive">{ingredient.calories}</p>
				</div>
				<div className={styles.nutrient}>
					<p className="text text_type_main-default text_color_inactive">Белки, г</p>
					<p className="text text_type_digits-default text_color_inactive">{ingredient.proteins}</p>
				</div>
				<div className={styles.nutrient}>
					<p className="text text_type_main-default text_color_inactive">Жиры, г</p>
					<p className="text text_type_digits-default text_color_inactive">{ingredient.fat}</p>
				</div>
				<div className={styles.nutrient}>
					<p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
					<p className="text text_type_digits-default text_color_inactive">{ingredient.carbohydrates}</p>
				</div>
			</div>
		</div>
	);
};

export default IngredientDetails;