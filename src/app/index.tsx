import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {AppDispatch, RootState} from '../store';
import { fetchIngredients, addIngredientToConstructor, removeIngredientFromConstructor, moveIngredientInConstructor } from '../features/appSlice';
import Header from '@components/header/header';
import styles from './app.module.scss';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Ingredient, SelectedIngredient } from '../types';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients';
import BurgerConstructor from '@components/burger-constructor/burger-constructor';

export const App: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		ingredients,
		ingredientsStatus,
		ingredientsError,
		constructorData
	} = useSelector((state: RootState) => state.app);

	const selectedIngredients: SelectedIngredient[] = constructorData.bun
		? [constructorData.bun, ...constructorData.ingredients, constructorData.bun]
		: constructorData.ingredients;

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);


	const handleAddIngredient = (ingredient: Ingredient) => {
		const newIngredient: SelectedIngredient = {
			...ingredient,
			uniqueId: `${ingredient._id}-${Date.now()}`
		};
		const isAlreadyAdded = constructorData.ingredients.some(
			item => item._id === newIngredient._id && item.uniqueId === newIngredient.uniqueId
		);
		if (!isAlreadyAdded || ingredient.type === 'bun') {
			dispatch(addIngredientToConstructor(newIngredient));
		}
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

	const isLoading = ingredientsStatus === 'pending';
	const error = ingredientsError;

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="page">
				<Header />
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
							<BurgerIngredients
								ingredients={ingredients}
								selectedIngredients={selectedIngredients}
								onAddIngredient={handleAddIngredient}
							/>
						</section>
						<section>
							<BurgerConstructor
								selectedIngredients={selectedIngredients}
								onAddIngredient={handleAddIngredient}
								onRemoveIngredient={handleRemoveIngredient}
								onMoveIngredient={handleMoveIngredient}
							/>
						</section>
					</main>
				)}
			</div>
		</DndProvider>
	);
};

export default App;