import { Ingredient } from "../types";

const API_URL = 'https://norma.nomoreparties.space/api/ingredients';

export const getIngredients = async (): Promise<Ingredient[]> => {
	try {
		const response = await fetch(API_URL);

		if (!response.ok) {
			throw new Error(`Ошибка HTTP: ${response.status}`);
		}

		const data = await response.json();

		if (!data.success) {
			throw new Error(`Ошибка API: ${data.message || 'Неизвестная ошибка'}`);
		}

		return data.data;
	} catch (error) {
		console.error('Ошибка при получении ингредиентов:', error);
		throw error;
	}
};