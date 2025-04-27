import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../src/features/appSlice';
import authReducer from '../src/features/authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
	reducer: {
		app: appReducer,
		auth: authReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

