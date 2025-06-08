import appReducer, {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientInConstructor,
  setSelectedIngredient,
  clearConstructor,
  resetOrderStatus,
  setIngredients,
  fetchIngredients,
  createOrder,
} from './appSlice';

describe('appSlice', () => {
  const initialState = {
    ingredients: [],
    ingredientsMap: {},
    ingredientsStatus: 'idle',
    ingredientsError: null,
    constructorData: {
      bun: null,
      ingredients: [],
    },
    selectedIngredient: null,
    order: null,
    orderStatus: 'idle',
    orderError: null,
  };

  const mockIngredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'test.jpg',
    image_mobile: 'test-mobile.jpg',
    image_large: 'test-large.jpg',
    __v: 0,
  };

  const mockSelectedIngredient = {
    ...mockIngredient,
    uniqueId: '123',
  };

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(appReducer(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    it('should handle addIngredientToConstructor with bun', () => {
      const bunIngredient = {
        ...mockSelectedIngredient,
        type: 'bun',
      };
      const nextState = appReducer(
        initialState,
        addIngredientToConstructor(bunIngredient)
      );
      expect(nextState.constructorData.bun).toEqual(bunIngredient);
      expect(nextState.constructorData.ingredients).toEqual([]);
    });

    it('should handle addIngredientToConstructor with non-bun ingredient', () => {
      const nextState = appReducer(
        initialState,
        addIngredientToConstructor(mockSelectedIngredient)
      );
      expect(nextState.constructorData.bun).toBeNull();
      expect(nextState.constructorData.ingredients).toEqual([mockSelectedIngredient]);
    });

    it('should handle removeIngredientFromConstructor', () => {
      const state = {
        ...initialState,
        constructorData: {
          bun: null,
          ingredients: [mockSelectedIngredient],
        },
      };
      const nextState = appReducer(state, removeIngredientFromConstructor(0));
      expect(nextState.constructorData.ingredients).toEqual([]);
    });

    it('should handle moveIngredientInConstructor', () => {
      const ingredient1 = { ...mockSelectedIngredient, uniqueId: '1' };
      const ingredient2 = { ...mockSelectedIngredient, uniqueId: '2' };
      const state = {
        ...initialState,
        constructorData: {
          bun: null,
          ingredients: [ingredient1, ingredient2],
        },
      };
      const nextState = appReducer(
        state,
        moveIngredientInConstructor({ dragIndex: 0, hoverIndex: 1 })
      );
      expect(nextState.constructorData.ingredients).toEqual([ingredient2, ingredient1]);
    });

    it('should handle setSelectedIngredient', () => {
      const nextState = appReducer(
        initialState,
        setSelectedIngredient(mockIngredient)
      );
      expect(nextState.selectedIngredient).toEqual(mockIngredient);
    });

    it('should handle clearConstructor', () => {
      const state = {
        ...initialState,
        constructorData: {
          bun: mockSelectedIngredient,
          ingredients: [mockSelectedIngredient],
        },
      };
      const nextState = appReducer(state, clearConstructor());
      expect(nextState.constructorData).toEqual({
        bun: null,
        ingredients: [],
      });
    });

    it('should handle resetOrderStatus', () => {
      const state = {
        ...initialState,
        orderStatus: 'succeeded',
        orderError: 'error',
        order: { success: true, name: 'test', order: { number: 1 } },
      };
      const nextState = appReducer(state, resetOrderStatus());
      expect(nextState.orderStatus).toBe('idle');
      expect(nextState.orderError).toBeNull();
      expect(nextState.order).toBeNull();
    });

    it('should handle setIngredients', () => {
      const ingredients = [mockIngredient];
      const nextState = appReducer(initialState, setIngredients(ingredients));
      expect(nextState.ingredients).toEqual(ingredients);
      expect(nextState.ingredientsMap).toEqual({
        [mockIngredient._id]: mockIngredient,
      });
    });
  });

  describe('extra reducers', () => {
    describe('fetchIngredients', () => {
      it('should handle pending state', () => {
        const pendingAction = fetchIngredients.pending('requestId');
        const nextState = appReducer(initialState, pendingAction);
        expect(nextState.ingredientsStatus).toBe('pending');
        expect(nextState.ingredientsError).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const ingredients = [mockIngredient];
        const fulfilledAction = fetchIngredients.fulfilled(ingredients, 'requestId');
        const nextState = appReducer(initialState, fulfilledAction);
        expect(nextState.ingredients).toEqual(ingredients);
        expect(nextState.ingredientsMap).toEqual({
          [mockIngredient._id]: mockIngredient,
        });
        expect(nextState.ingredientsStatus).toBe('succeeded');
        expect(nextState.ingredientsError).toBeNull();
      });

      it('should handle rejected state', () => {
        const error = 'Failed to fetch';
        const rejectedAction = fetchIngredients.rejected(null, 'requestId', undefined, error);
        const nextState = appReducer(initialState, rejectedAction);
        expect(nextState.ingredientsStatus).toBe('failed');
        expect(nextState.ingredientsError).toBe(error);
      });
    });

    describe('createOrder', () => {
      it('should handle pending state', () => {
        const pendingAction = createOrder.pending('requestId', { ingredients: ['1'], token: 'token' });
        const nextState = appReducer(initialState, pendingAction);
        expect(nextState.orderStatus).toBe('pending');
        expect(nextState.orderError).toBeNull();
        expect(nextState.order).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const orderResponse = {
          success: true,
          name: 'Test Order',
          order: { number: 123 },
        };
        const fulfilledAction = createOrder.fulfilled(orderResponse, 'requestId', { ingredients: ['1'], token: 'token' });
        const nextState = appReducer(initialState, fulfilledAction);
        expect(nextState.order).toEqual(orderResponse);
        expect(nextState.orderStatus).toBe('succeeded');
        expect(nextState.orderError).toBeNull();
        expect(nextState.constructorData).toEqual({
          bun: null,
          ingredients: [],
        });
      });

      it('should handle rejected state', () => {
        const error = 'Failed to create order';
        const rejectedAction = createOrder.rejected(null, 'requestId', { ingredients: ['1'], token: 'token' }, error);
        const nextState = appReducer(initialState, rejectedAction);
        expect(nextState.orderStatus).toBe('failed');
        expect(nextState.orderError).toBe(error);
      });
    });
  });
}); 