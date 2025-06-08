import reducer, {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  ProfileOrdersState,
  ProfileOrder
} from './profileOrdersSlice';

describe('profileOrdersSlice', () => {
  const initialState: ProfileOrdersState = {
    orders: [],
    total: 0,
    totalToday: 0,
    wsConnected: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle wsConnecting', () => {
    const prevState = { ...initialState, wsConnected: true, error: 'error' };
    const nextState = reducer(prevState, wsConnecting());
    expect(nextState.wsConnected).toBe(false);
    expect(nextState.error).toBeNull();
  });

  it('should handle wsOpen', () => {
    const prevState = { ...initialState, wsConnected: false, error: 'error' };
    const nextState = reducer(prevState, wsOpen());
    expect(nextState.wsConnected).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should handle wsClose', () => {
    const prevState = { ...initialState, wsConnected: true };
    const nextState = reducer(prevState, wsClose());
    expect(nextState.wsConnected).toBe(false);
  });

  it('should handle wsError', () => {
    const prevState = { ...initialState, wsConnected: true, error: null };
    const errorMsg = 'Ошибка соединения';
    const nextState = reducer(prevState, wsError(errorMsg));
    expect(nextState.error).toBe(errorMsg);
    expect(nextState.wsConnected).toBe(false);
  });

  it('should handle wsMessage', () => {
    const orders: ProfileOrder[] = [
      {
        _id: '1',
        number: 1,
        name: 'Order 1',
        status: 'done',
        ingredients: ['a', 'b'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    const payload = {
      orders,
      total: 10,
      totalToday: 2,
    };
    const nextState = reducer(initialState, wsMessage(payload));
    expect(nextState.orders).toEqual(orders);
    expect(nextState.total).toBe(10);
    expect(nextState.totalToday).toBe(2);
  });
}); 