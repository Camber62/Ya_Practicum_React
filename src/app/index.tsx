import React, {useCallback, useEffect, useMemo, useState} from "react";
import Header from "@components/header/header";
import {getIngredients} from "../api/get-ingredients";
import styles from './app.module.scss';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {Ingredient, SelectedIngredient} from "../types";
import BurgerIngredients from "@components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "@components/burger-constructor/burger-constructor";


export const App: React.FC = () => {
	// Состояния для управления данными приложения
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Мемоизация доступных ингредиентов для предотвращения лишних вычислений
	const availableIngredients = useMemo(() => {
		return ingredients.filter((item) => ['bun', 'sauce', 'main'].includes(item.type));
	}, [ingredients]);

	// Загрузка ингредиентов при монтировании компонента
	useEffect(() => {
		const loadIngredients = async () => {
			try {
				const data = await getIngredients();
				const validData = data.filter((item: any): item is Ingredient =>
					['bun', 'sauce', 'main'].includes(item.type)
				);

				setIngredients(validData);

				if (validData.length >= 10) {
					const bun = {...validData[0], uniqueId: `${validData[0]._id}-${Date.now()}`};
					setSelectedIngredients([bun, bun]);
				}
			} catch (err) {
				setError('Ошибка при загрузке данных');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		loadIngredients();
	}, []);

	// Добавление ингредиента в конструктор
	const handleAddIngredient = useCallback((ingredient: Ingredient) => {
		setSelectedIngredients((prev) => {
			const newIngredient = {...ingredient, uniqueId: `${ingredient._id}-${Date.now()}`};
			if (ingredient.type === 'bun') {
				// Сохраняем начинки, заменяем только булки
				const fillings = prev.filter((item) => item.type !== 'bun');
				return [newIngredient, ...fillings, newIngredient]; // Новая верхняя булка, начинки, новая нижняя булка
			}
			// Добавление начинки
			const buns = prev.filter((item) => item.type === 'bun');
			const fillings = prev.filter((item) => item.type !== 'bun');
			return [...buns.slice(0, 1), ...fillings, newIngredient, ...buns.slice(1)];
		});
	}, []);

	// Удаление ингредиента из конструктора
	const handleRemoveIngredient = useCallback((indexToRemove: number) => {
		setSelectedIngredients((prev) => prev.filter((_, index) => index !== indexToRemove));
	}, []);

	// Перемещение ингредиентов в конструкторе
	const handleMoveIngredient = useCallback((dragIndex: number, hoverIndex: number) => {
		setSelectedIngredients((prev) => {
			const updatedIngredients = [...prev];
			const buns = updatedIngredients.filter((item) => item.type === 'bun');
			const fillings = updatedIngredients.filter((item) => item.type !== 'bun');

			if (dragIndex === hoverIndex) return prev;

			const [draggedItem] = fillings.splice(dragIndex, 1);
			fillings.splice(hoverIndex, 0, draggedItem);

			return [...buns.slice(0, 1), ...fillings, ...buns.slice(1)];
		});
	}, []);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="page">
				<header>
					<Header/>
				</header>
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
								ingredients={availableIngredients}
								selectedIngredients={selectedIngredients}
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