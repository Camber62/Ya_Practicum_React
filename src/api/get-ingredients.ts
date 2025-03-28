import { Ingredient } from "../types";
import { request } from "../utils/api";

export const getIngredients = async (): Promise<Ingredient[]> => {
	try {
		const data = await request("ingredients");
		return data.data;
	} catch (error) {
		console.error('Ошибка при получении ингредиентов:', error);
		throw error;
	}
};