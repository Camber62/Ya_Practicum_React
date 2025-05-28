import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../src/features/appSlice';
import authReducer from '../src/features/authSlice';
import feedReducer from './features/feedSlice';
import profileOrdersReducer from './features/profileOrdersSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { feedMiddleware } from './middleware/feedMiddleware';
import { profileOrdersMiddleware } from './middleware/profileOrdersMiddleware';

export const store = configureStore({
	reducer: {
		app: appReducer,
		auth: authReducer,
		feed: feedReducer,
		profileOrders: profileOrdersReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

