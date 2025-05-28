import { Middleware } from '@reduxjs/toolkit';
import {
	wsConnect,
	wsDisconnect,
	wsError,
	wsMessage,
	wsClose,
} from '../features/profileOrdersSlice';

export const profileOrdersMiddleware: Middleware = (store) => {
	let socket: WebSocket | null = null;

	return (next) => (action) => {
		if (wsConnect.match(action)) {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				store.dispatch(wsError('Нет токена авторизации'));
				return;
			}
			socket = new WebSocket(
				`wss://norma.nomoreparties.space/orders?token=${token}`
			);
			socket.onopen = () => store.dispatch(wsConnect());
			socket.onclose = () => store.dispatch(wsClose());
			socket.onerror = () => store.dispatch(wsError('WebSocket error'));
			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data.success) {
						store.dispatch(
							wsMessage({
								orders: data.orders,
								total: data.total,
								totalToday: data.totalToday,
							})
						);
					} else {
						store.dispatch(wsError(data.message || 'Ошибка получения данных'));
					}
				} catch (e) {
					store.dispatch(wsError('Ошибка парсинга данных'));
				}
			};
		}
		if (wsDisconnect.match(action) && socket) {
			socket.close();
			socket = null;
		}
		return next(action);
	};
};
