import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../store';
import { refreshToken } from '../api/auth';

export interface WebSocketActionTypes {
	connect: string;
	disconnect: string;
	connecting: string;
	open: string;
	close: string;
	error: string;
	message: string;
	sendMessage?: string;
}

export interface WebSocketPayload {
	url: string;
	token?: string;
	data?: unknown;
}

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 3000;

// Хранилище активных подключений
const activeConnections = new Map<string, WebSocket>();

export const createSocketMiddleware = (
	actionTypes: WebSocketActionTypes
): Middleware => {
	return (store: MiddlewareAPI<AppDispatch, RootState>) => {
		let reconnectAttempts = 0;
		let reconnectTimeout: NodeJS.Timeout | null = null;

		const connect = (url: string, token?: string) => {
			const wsUrl = token ? `${url}?token=${token}` : url;

			// Проверяем, нет ли уже активного подключения к этому URL
			if (activeConnections.has(wsUrl)) {
				console.log('Уже существует активное подключение к:', wsUrl);
				return;
			}

			// Закрываем существующее подключение, если оно есть
			const existingSocket = activeConnections.get(wsUrl);
			if (existingSocket) {
				console.log('Закрываем существующее подключение:', wsUrl);
				existingSocket.close(1000, 'Новое подключение');
				activeConnections.delete(wsUrl);
			}

			console.log('Создаем новое подключение к:', wsUrl);
			const socket = new WebSocket(wsUrl);
			activeConnections.set(wsUrl, socket);
			store.dispatch({ type: actionTypes.connecting });

			socket.onopen = () => {
				console.log('Подключение установлено:', wsUrl);
				reconnectAttempts = 0;
				store.dispatch({ type: actionTypes.open });
			};

			socket.onerror = async (event) => {
				console.log('Ошибка подключения:', wsUrl, event);
				if (token) {
					try {
						const refreshTokenValue = localStorage.getItem('refreshToken');
						if (refreshTokenValue) {
							const response = await refreshToken(refreshTokenValue);
							const newToken = response.accessToken.replace('Bearer ', '');
							localStorage.setItem('accessToken', newToken);
							localStorage.setItem('refreshToken', response.refreshToken);

							// Переподключаемся с новым токеном
							const newWsUrl = `${url}?token=${newToken}`;
							if (activeConnections.has(newWsUrl)) {
								activeConnections
									.get(newWsUrl)
									?.close(1000, 'Обновление токена');
								activeConnections.delete(newWsUrl);
							}
							connect(url, newToken);
							return;
						}
					} catch (error) {
						console.error('Ошибка обновления токена:', error);
					}
				}
				store.dispatch({ type: actionTypes.error, payload: event });
			};

			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					store.dispatch({ type: actionTypes.message, payload: data });
				} catch (error) {
					store.dispatch({
						type: actionTypes.error,
						payload: 'Ошибка парсинга данных',
					});
				}
			};

			socket.onclose = (event) => {
				console.log('Подключение закрыто:', wsUrl, event.code, event.reason);
				activeConnections.delete(wsUrl);
				store.dispatch({ type: actionTypes.close, payload: event });

				// Пытаемся восстановить соединение только если это не было намеренное закрытие
				if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
					console.log('Попытка переподключения:', reconnectAttempts + 1);
					if (reconnectTimeout) {
						clearTimeout(reconnectTimeout);
					}
					reconnectTimeout = setTimeout(() => {
						reconnectAttempts++;
						connect(url, token);
					}, RECONNECT_DELAY);
				}
			};
		};

		return (next) => (action) => {
			if (typeof action === 'object' && action !== null && 'type' in action) {
				const { type, payload } = action as {
					type: string;
					payload?: WebSocketPayload;
				};

				if (type === actionTypes.connect && payload?.url) {
					console.log('Получен action connect:', payload.url);
					if (reconnectTimeout) {
						clearTimeout(reconnectTimeout);
						reconnectTimeout = null;
					}

					const wsUrl = payload.token
						? `${payload.url}?token=${payload.token}`
						: payload.url;

					// Проверяем существующее подключение
					const existingSocket = activeConnections.get(wsUrl);
					if (existingSocket && existingSocket.readyState === WebSocket.OPEN) {
						console.log('Уже подключены к:', wsUrl);
						return next(action);
					}

					connect(payload.url, payload.token);
				}

				if (type === actionTypes.disconnect) {
					console.log('Получен action disconnect');
					if (reconnectTimeout) {
						clearTimeout(reconnectTimeout);
						reconnectTimeout = null;
					}

					// Закрываем все активные подключения для этого middleware
					activeConnections.forEach((socket, url) => {
						if (url.includes(actionTypes.connect.split('/')[0])) {
							console.log('Закрываем подключение:', url);
							socket.close(1000, 'Отключение по запросу');
							activeConnections.delete(url);
						}
					});
					reconnectAttempts = 0;
				}

				if (type === actionTypes.sendMessage) {
					// Находим нужное подключение и отправляем сообщение
					activeConnections.forEach((socket) => {
						if (socket.readyState === WebSocket.OPEN) {
							socket.send(JSON.stringify(payload?.data));
						}
					});
				}
			}

			return next(action);
		};
	};
};
