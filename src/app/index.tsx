import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {AppDispatch, RootState} from '../store';
import { fetchIngredients } from '../features/appSlice';
import Header from '@components/header/header';
import styles from './app.module.scss';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients';
import BurgerConstructor from '@components/burger-constructor/burger-constructor';

export const App: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		ingredientsStatus,
		ingredientsError,
	} = useSelector((state: RootState) => state.app);

	useEffect(() => {
		dispatch(fetchIngredients());
	}, [dispatch]);

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
							<BurgerIngredients />
						</section>
						<section>
							<BurgerConstructor />
						</section>
					</main>
				)}
			</div>
		</DndProvider>
	);
};

export default App;