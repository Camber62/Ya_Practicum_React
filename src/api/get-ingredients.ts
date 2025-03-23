
const API_URL = 'https://norma.nomoreparties.space/api/ingredients';

export interface Ingredient {
	_id: string;
	name: string;
	type: 'bun' | 'sauce' | 'main';
	proteins: number;
	fat: number;
	carbohydrates: number;
	calories: number;
	price: number;
	image: string;
	image_mobile: string;
	image_large: string;
	__v: number;
}

export const getIngredients = async (): Promise<Ingredient[]> => {
	try {
		const response = await fetch(API_URL);

		const data = await response.json();

		return data.data;
	} catch (error) {
		console.error('Error fetching ingredients:', error);
		throw error;
	}
};