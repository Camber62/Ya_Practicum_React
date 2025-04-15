import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../src/features/appSlice';
import authReducer from '../src/features/authSlice';
export const store = configureStore({
	reducer: {
		app: appReducer,
		auth: authReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

