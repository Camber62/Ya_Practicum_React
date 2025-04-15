import { request } from '../utils/api';
import { refreshToken } from './auth';

interface OrderRequest {
  ingredients: string[];
}

interface OrderResponse {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
}

export const placeOrder = async (ingredients: string[], token: string) => {
  // Внутренняя функция для выполнения запроса
  const tryPlaceOrder = async (currentToken: string) => {
    return await request('orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ ingredients }),
    }) as Promise<OrderResponse>;
  };

  try {
    return await tryPlaceOrder(token);
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      // Пробуем обновить токен
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token');
      }

      const refreshResponse = await refreshToken(refreshTokenValue);
      localStorage.setItem('accessToken', refreshResponse.accessToken.replace('Bearer ', ''));
      localStorage.setItem('refreshToken', refreshResponse.refreshToken);

      const newAccessToken = localStorage.getItem('accessToken');
      if (!newAccessToken) {
        throw new Error('No access token after refresh');
      }

      return await tryPlaceOrder(newAccessToken);
    }
    console.error('Error creating order:', error);
    throw error;
  }
};