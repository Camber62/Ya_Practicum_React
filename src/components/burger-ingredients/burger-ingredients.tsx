import React, { FC, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import styles from './burger-ingredients.module.scss';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../types';
import IngredientCard from './ingredient-card';
import IngredientDetails from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { useModal } from '../../hooks/useModal';
import { setSelectedIngredient, addIngredientToConstructor } from '../../features/appSlice';

const BurgerIngredients: FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isModalOpen, openModal, closeModal } = useModal();
	const [currentTab, setCurrentTab] = useState<string>('bun');

	// Получение данных из Redux store
	const { ingredients, constructorData } = useSelector((state: RootState) => state.app);

	// Рефы для отслеживания позиций секций при скролле
	const bunRef = useRef<HTMLHeadingElement>(null);
	const sauceRef = useRef<HTMLHeadingElement>(null);
	const mainRef = useRef<HTMLHeadingElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Фильтрация ингредиентов по типам
	const buns = ingredients.filter((item) => item.type === 'bun');
	const sauces = ingredients.filter((item) => item.type === 'sauce');
	const mains = ingredients.filter((item) => item.type === 'main');

	// Формирование массива выбранных ингредиентов с учетом булок
	const selectedIngredients = constructorData.bun
		? [constructorData.bun, ...constructorData.ingredients, constructorData.bun]
		: constructorData.ingredients;

	// Подсчет количества каждого ингредиента в конструкторе
	const counters = selectedIngredients.reduce((acc, item) => {
		acc[item._id] = (acc[item._id] || 0) + 1;
		return acc;
	}, {} as { [key: string]: number });

	const handleOpenModal = (ingredient: Ingredient) => {
		dispatch(setSelectedIngredient(ingredient));
		openModal();
	};

	const handleCloseModal = () => {
		closeModal();
		dispatch(setSelectedIngredient(null));
	};

	// Обработчик добавления ингредиента в конструктор
	const handleAddIngredient = (ingredient: Ingredient) => {
		const newIngredient = {
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

	// Обработчик переключения табов
	const handleTabClick = (value: string) => {
		setCurrentTab(value);
		const ref = value === 'bun' ? bunRef : value === 'sauce' ? sauceRef : mainRef;
		ref.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Обработчик скролла для определения активного таба
	const handleScroll = () => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer) return;

		const bunTop = bunRef.current?.getBoundingClientRect().top || 0;
		const sauceTop = sauceRef.current?.getBoundingClientRect().top || 0;
		const mainTop = mainRef.current?.getBoundingClientRect().top || 0;
		const scrollTop = scrollContainer.getBoundingClientRect().top;

		// Определяем, какая секция ближе всего к верху контейнера
		if (bunTop >= scrollTop && bunTop <= scrollTop + 100) {
			setCurrentTab('bun');
		} else if (sauceTop >= scrollTop && sauceTop <= scrollTop + 100) {
			setCurrentTab('sauce');
		} else if (mainTop >= scrollTop && mainTop <= scrollTop + 100) {
			setCurrentTab('main');
		}
	};

	// Добавляем слушатель события скролла
	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll);
		}
		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	return (
		<section className={styles.ingredients}>
			<h1 className="text text_type_main-large mb-5">Соберите бургер</h1>

			<nav className={`${styles.tabs} mb-10`}>
				<Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
					Булки
				</Tab>
				<Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
					Соусы
				</Tab>
				<Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
					Начинки
				</Tab>
			</nav>

			<div className={styles.scrollContainer} ref={scrollContainerRef}>
				<article className="mb-10">
					<h2 className="text text_type_main-medium mb-6" ref={bunRef}>
						Булки
					</h2>
					<ul className={styles.grid}>
						{buns.map((item) => (
							<IngredientCard
								key={item._id}
								ingredient={item}
								count={counters[item._id] || 0}
								onClick={handleOpenModal}
								onAdd={handleAddIngredient}
							/>
						))}
					</ul>
				</article>

				<article className="mb-10">
					<h2 className="text text_type_main-medium mb-6" ref={sauceRef}>
						Соусы
					</h2>
					<ul className={styles.grid}>
						{sauces.map((item) => (
							<IngredientCard
								key={item._id}
								ingredient={item}
								count={counters[item._id] || 0}
								onClick={handleOpenModal}
								onAdd={handleAddIngredient}
							/>
						))}
					</ul>
				</article>

				<article className="mb-10">
					<h2 className="text text_type_main-medium mb-6" ref={mainRef}>
						Начинки
					</h2>
					<ul className={styles.grid}>
						{mains.map((item) => (
							<IngredientCard
								key={item._id}
								ingredient={item}
								count={counters[item._id] || 0}
								onClick={handleOpenModal}
								onAdd={handleAddIngredient}
							/>
						))}
					</ul>
				</article>
			</div>

			{isModalOpen && (
				<Modal title="Детали ингредиента" onClose={handleCloseModal}>
					<IngredientDetails />
				</Modal>
			)}
		</section>
	);
};

export default BurgerIngredients;