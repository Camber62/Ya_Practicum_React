import React, { useState } from 'react';
import styles from './burger-ingredients.module.scss';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import {BurgerIngredientsProps, Ingredient} from "../../types";
import IngredientCard from "@components/burger-ingredients/ingredient-card";
import IngredientDetails from "@components/ingredient-details/ingredient-details";
import Modal from "@components/modal/modal";
import {useModal} from "../../hooks/useModal";

const BurgerIngredients: React.FC<BurgerIngredientsProps> = ({ ingredients, selectedIngredients }) => {
	const [currentTab, setCurrentTab] = useState<string>('bun');
	const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
	const { isModalOpen, openModal, closeModal } = useModal();

	const buns = ingredients.filter((item) => item.type === 'bun');
	const sauces = ingredients.filter((item) => item.type === 'sauce');
	const mains = ingredients.filter((item) => item.type === 'main');

	const displayedIngredients = currentTab === 'bun' ? buns : currentTab === 'sauce' ? sauces : mains;
	const sectionTitle = currentTab === 'bun' ? 'Булки' : currentTab === 'sauce' ? 'Соусы' : 'Начинки';

	const counters = selectedIngredients.reduce((acc, item) => {
		acc[item._id] = (acc[item._id] || 0) + 1;
		return acc;
	}, {} as { [key: string]: number });

	const handleOpenModal = (ingredient: Ingredient) => {
		setSelectedIngredient(ingredient);
		openModal();
	};

	const handleCloseModal = () => {
		closeModal();
		setSelectedIngredient(null);
	};

	return (
		<section className={styles.ingredients}>
			<h1 className="text text_type_main-large mb-5">Соберите бургер</h1>

			<nav className={`${styles.tabs} mb-10`}>
				<Tab value="bun" active={currentTab === 'bun'} onClick={setCurrentTab}>
					Булки
				</Tab>
				<Tab value="sauce" active={currentTab === 'sauce'} onClick={setCurrentTab}>
					Соусы
				</Tab>
				<Tab value="main" active={currentTab === 'main'} onClick={setCurrentTab}>
					Начинки
				</Tab>
			</nav>

			<div className={styles.scrollContainer}>
				<article className="mb-10">
					<h2 className="text text_type_main-medium mb-6">{sectionTitle}</h2>
					<ul className={styles.grid}>
						{displayedIngredients.map((item) => (
							<IngredientCard
								key={item._id}
								ingredient={item}
								count={counters[item._id] || 0}
								onClick={handleOpenModal}
							/>
						))}
					</ul>
				</article>
			</div>

			{isModalOpen && selectedIngredient && (
				<Modal title="Детали ингредиента" onClose={handleCloseModal}>
					<IngredientDetails ingredient={selectedIngredient} />
				</Modal>
			)}
		</section>
	);
};

export default BurgerIngredients;