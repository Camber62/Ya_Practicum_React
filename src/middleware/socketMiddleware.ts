import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../store';

interface SocketMiddlewareConfig {
  wsConnect: string;
  wsDisconnect: string;
  wsConnecting: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
  wsSendMessage?: string;
}

export const socketMiddleware = (wsUrl: string, config: SocketMiddlewareConfig): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: unknown) => {
      if (typeof action === 'object' && action !== null && 'type' in action) {
        const { type, payload } = action as { type: string; payload?: unknown };

        if (type === config.wsConnect) {
          const token = payload && typeof payload === 'object' && 'token' in payload 
            ? (payload as { token: string }).token 
            : undefined;
          const url = token ? `${wsUrl}?token=${token}` : wsUrl;
          socket = new WebSocket(url);
          store.dispatch({ type: config.wsConnecting });
        }

        if (socket) {
          socket.onopen = () => {
            store.dispatch({ type: config.onOpen });
          };

          socket.onerror = (event) => {
            store.dispatch({ type: config.onError, payload: event });
          };

          socket.onmessage = (event) => {
            const { data } = event;
            const parsedData = JSON.parse(data);
            store.dispatch({ type: config.onMessage, payload: parsedData });
          };

          socket.onclose = (event) => {
            store.dispatch({ type: config.onClose, payload: event });
          };

          if (type === config.wsSendMessage && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
          }

          if (type === config.wsDisconnect) {
            socket.close();
            socket = null;
          }
        }
      }

      return next(action);
    };
  };
};

export default socketMiddleware; 