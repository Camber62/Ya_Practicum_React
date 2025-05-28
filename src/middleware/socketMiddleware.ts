import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../store';

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

export const createSocketMiddleware = (
	actionTypes: WebSocketActionTypes
): Middleware => {
	return (store: MiddlewareAPI<AppDispatch, RootState>) => {
		let socket: WebSocket | null = null;

		return (next) => (action) => {
			const { dispatch } = store;

			if (typeof action === 'object' && action !== null && 'type' in action) {
				const { type, payload } = action as {
					type: string;
					payload?: WebSocketPayload;
				};

				if (type === actionTypes.connect && payload?.url) {
					const url = payload.token
						? `${payload.url}?token=${payload.token}`
						: payload.url;

					socket = new WebSocket(url);
					dispatch({ type: actionTypes.connecting });

					socket.onopen = () => {
						dispatch({ type: actionTypes.open });
					};

					socket.onerror = (event) => {
						dispatch({ type: actionTypes.error, payload: event });
					};

					socket.onmessage = (event) => {
						try {
							const data = JSON.parse(event.data);
							dispatch({ type: actionTypes.message, payload: data });
						} catch (error) {
							dispatch({
								type: actionTypes.error,
								payload: 'Ошибка парсинга данных',
							});
						}
					};

					socket.onclose = (event) => {
						dispatch({ type: actionTypes.close, payload: event });
					};
				}

				if (socket) {
					if (
						type === actionTypes.sendMessage &&
						socket.readyState === WebSocket.OPEN
					) {
						socket.send(JSON.stringify(payload?.data));
					}

					if (type === actionTypes.disconnect) {
						socket.close();
						socket = null;
					}
				}
			}

			return next(action);
		};
	};
};
