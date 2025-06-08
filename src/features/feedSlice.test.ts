import feedReducer, {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  FeedOrder,
} from './feedSlice';

describe('feedSlice', () => {
  const initialState = {
    orders: [] as FeedOrder[],
    total: 0,
    totalToday: 0,
    wsConnected: false,
    error: null as string | null,
  };

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(feedReducer(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    it('should handle wsConnecting', () => {
      const nextState = feedReducer(initialState, wsConnecting());
      expect(nextState.wsConnected).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('should handle wsOpen', () => {
      const nextState = feedReducer(initialState, wsOpen());
      expect(nextState.wsConnected).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('should handle wsClose', () => {
      const state = { ...initialState, wsConnected: true };
      const nextState = feedReducer(state, wsClose());
      expect(nextState.wsConnected).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('should handle wsError', () => {
      const error = 'Connection error';
      const nextState = feedReducer(initialState, wsError(error));
      expect(nextState.error).toBe(error);
      expect(nextState.wsConnected).toBe(false);
    });

    it('should handle wsMessage', () => {
      const message = {
        orders: [
          {
            _id: '1',
            number: 1,
            name: 'Test Order',
            status: 'done',
            ingredients: ['1', '2'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 100,
        totalToday: 10,
      };
      const nextState = feedReducer(initialState, wsMessage(message));
      expect(nextState.orders).toEqual(message.orders);
      expect(nextState.total).toBe(message.total);
      expect(nextState.totalToday).toBe(message.totalToday);
    });
  });

  describe('action types', () => {
    it('should have correct action types', () => {
      expect(wsConnecting.type).toBe('feed/wsConnecting');
      expect(wsOpen.type).toBe('feed/wsOpen');
      expect(wsClose.type).toBe('feed/wsClose');
      expect(wsError.type).toBe('feed/wsError');
      expect(wsMessage.type).toBe('feed/wsMessage');
    });
  });
}); 