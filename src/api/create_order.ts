import { request } from "../utils/api";

export const createOrder = async (ingredientIds: string[]): Promise<any> => {
	try {
		return await request("orders", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ingredients: ingredientIds
			})
		});
	} catch (error) {
		console.error('Error creating order:', error);
		throw error;
	}
};