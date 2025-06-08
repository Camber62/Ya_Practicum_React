import authReducer, {
  resetAuthError,
  setAuthError,
  registerUser,
  loginUser,
  logoutUser,
  getUserRequest,
  updateUserProfile,
  selectIsAuthenticated,
} from './authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    authStatus: 'idle',
    authError: null,
    isAuthChecked: false,
  };

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    it('should handle resetAuthError', () => {
      const state = { ...initialState, authError: 'Error' };
      const nextState = authReducer(state, resetAuthError());
      expect(nextState.authError).toBeNull();
    });

    it('should handle setAuthError', () => {
      const error = 'Test error';
      const nextState = authReducer(initialState, setAuthError(error));
      expect(nextState.authError).toBe(error);
    });
  });

  describe('extra reducers', () => {
    describe('registerUser', () => {
      it('should handle pending state', () => {
        const pendingAction = registerUser.pending('requestId', { email: 'test@example.com', password: 'password', name: 'Test User' });
        const nextState = authReducer(initialState, pendingAction);
        expect(nextState.authStatus).toBe('pending');
        expect(nextState.authError).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const fulfilledAction = registerUser.fulfilled(mockUser, 'requestId', { email: 'test@example.com', password: 'password', name: 'Test User' });
        const nextState = authReducer(initialState, fulfilledAction);
        expect(nextState.user).toEqual(mockUser);
        expect(nextState.authStatus).toBe('succeeded');
        expect(nextState.authError).toBeNull();
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should handle rejected state', () => {
        const error = 'Registration failed';
        const rejectedAction = registerUser.rejected(new Error(error), 'requestId', { email: 'test@example.com', password: 'password', name: 'Test User' }, 'Не удалось зарегистрироваться');
        const nextState = authReducer(initialState, rejectedAction);
        expect(nextState.authStatus).toBe('failed');
        expect(nextState.authError).toBe('Не удалось зарегистрироваться');
      });
    });

    describe('loginUser', () => {
      it('should handle pending state', () => {
        const pendingAction = loginUser.pending('requestId', { email: 'test@example.com', password: 'password' });
        const nextState = authReducer(initialState, pendingAction);
        expect(nextState.authStatus).toBe('pending');
        expect(nextState.authError).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const fulfilledAction = loginUser.fulfilled(mockUser, 'requestId', { email: 'test@example.com', password: 'password' });
        const nextState = authReducer(initialState, fulfilledAction);
        expect(nextState.user).toEqual(mockUser);
        expect(nextState.authStatus).toBe('succeeded');
        expect(nextState.authError).toBeNull();
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should handle rejected state', () => {
        const error = 'Login failed';
        const rejectedAction = loginUser.rejected(new Error(error), 'requestId', { email: 'test@example.com', password: 'password' }, 'Не удалось войти');
        const nextState = authReducer(initialState, rejectedAction);
        expect(nextState.authStatus).toBe('failed');
        expect(nextState.authError).toBe('Не удалось войти');
      });
    });

    describe('logoutUser', () => {
      it('should handle pending state', () => {
        const pendingAction = logoutUser.pending('requestId');
        const nextState = authReducer(initialState, pendingAction);
        expect(nextState.authStatus).toBe('pending');
        expect(nextState.authError).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const fulfilledAction = logoutUser.fulfilled(undefined, 'requestId');
        const nextState = authReducer({ ...initialState, user: mockUser }, fulfilledAction);
        expect(nextState.user).toBeNull();
        expect(nextState.authStatus).toBe('succeeded');
        expect(nextState.authError).toBeNull();
      });

      it('should handle rejected state', () => {
        const error = 'Logout failed';
        const rejectedAction = logoutUser.rejected(new Error(error), 'requestId', undefined, 'Не удалось выйти');
        const nextState = authReducer(initialState, rejectedAction);
        expect(nextState.authStatus).toBe('failed');
        expect(nextState.authError).toBe('Не удалось выйти');
      });
    });

    describe('getUserRequest', () => {
      it('should handle pending state', () => {
        const pendingAction = getUserRequest.pending('requestId');
        const nextState = authReducer(initialState, pendingAction);
        expect(nextState.authStatus).toBe('pending');
        expect(nextState.authError).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const fulfilledAction = getUserRequest.fulfilled(mockUser, 'requestId');
        const nextState = authReducer(initialState, fulfilledAction);
        expect(nextState.user).toEqual(mockUser);
        expect(nextState.authStatus).toBe('succeeded');
        expect(nextState.authError).toBeNull();
        expect(nextState.isAuthChecked).toBe(true);
      });

      it('should handle rejected state', () => {
        const error = 'Get user failed';
        const rejectedAction = getUserRequest.rejected(new Error(error), 'requestId', undefined, 'Не удалось получить данные пользователя');
        const nextState = authReducer(initialState, rejectedAction);
        expect(nextState.authStatus).toBe('failed');
        expect(nextState.authError).toBe('Не удалось получить данные пользователя');
        expect(nextState.isAuthChecked).toBe(true);
      });
    });

    describe('updateUserProfile', () => {
      it('should handle pending state', () => {
        const pendingAction = updateUserProfile.pending('requestId', { name: 'New Name', email: 'new@example.com', password: 'newpassword' });
        const nextState = authReducer(initialState, pendingAction);
        expect(nextState.authStatus).toBe('pending');
        expect(nextState.authError).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const updatedUser = { ...mockUser, name: 'New Name' };
        const fulfilledAction = updateUserProfile.fulfilled(updatedUser, 'requestId', { name: 'New Name', email: 'new@example.com', password: 'newpassword' });
        const nextState = authReducer({ ...initialState, user: mockUser }, fulfilledAction);
        expect(nextState.user).toEqual(updatedUser);
        expect(nextState.authStatus).toBe('succeeded');
        expect(nextState.authError).toBeNull();
      });

      it('should handle rejected state', () => {
        const error = 'Update profile failed';
        const rejectedAction = updateUserProfile.rejected(new Error(error), 'requestId', { name: 'New Name', email: 'new@example.com', password: 'newpassword' }, 'Не удалось обновить профиль');
        const nextState = authReducer(initialState, rejectedAction);
        expect(nextState.authStatus).toBe('failed');
        expect(nextState.authError).toBe('Не удалось обновить профиль');
      });
    });
  });

  describe('selectors', () => {
    it('should select isAuthenticated correctly', () => {
      const state = {
        auth: {
          user: mockUser,
          authStatus: 'succeeded',
          authError: null,
          isAuthChecked: true,
        },
      };
      expect(selectIsAuthenticated(state)).toBe(true);

      const stateWithoutUser = {
        auth: {
          user: null,
          authStatus: 'succeeded',
          authError: null,
          isAuthChecked: true,
        },
      };
      expect(selectIsAuthenticated(stateWithoutUser)).toBe(false);
    });
  });
}); 