const API_URL = 'https://norma.nomoreparties.space/api';

export const createOrder = async (ingredientIds: string[]): Promise<any> => {
	try {
		const response = await fetch(`${API_URL}/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ingredients: ingredientIds
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error creating order:', error);
		throw error;
	}
};