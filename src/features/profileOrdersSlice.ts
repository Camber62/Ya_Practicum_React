import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebSocketActionTypes } from '../middleware/socketMiddleware';

export interface ProfileOrder {
	_id: string;
	number: number;
	name: string;
	status: string;
	ingredients: string[];
	createdAt: string;
	updatedAt: string;
}

export interface ProfileOrdersState {
	orders: ProfileOrder[];
	total: number;
	totalToday: number;
	wsConnected: boolean;
	error: string | null;
}

const initialState: ProfileOrdersState = {
	orders: [],
	total: 0,
	totalToday: 0,
	wsConnected: false,
	error: null,
};

export const PROFILE_ORDERS_WS_ACTIONS: WebSocketActionTypes = {
	connect: 'profileOrders/wsConnect',
	disconnect: 'profileOrders/wsDisconnect',
	connecting: 'profileOrders/wsConnecting',
	open: 'profileOrders/wsOpen',
	close: 'profileOrders/wsClose',
	error: 'profileOrders/wsError',
	message: 'profileOrders/wsMessage',
};

const profileOrdersSlice = createSlice({
	name: 'profileOrders',
	initialState,
	reducers: {
		wsConnecting(state) {
			state.wsConnected = false;
			state.error = null;
		},
		wsOpen(state) {
			state.wsConnected = true;
			state.error = null;
		},
		wsClose(state) {
			state.wsConnected = false;
		},
		wsError(state, action: PayloadAction<string>) {
			state.error = action.payload;
			state.wsConnected = false;
		},
		wsMessage(
			state,
			action: PayloadAction<{
				orders: ProfileOrder[];
				total: number;
				totalToday: number;
			}>
		) {
			state.orders = action.payload.orders;
			state.total = action.payload.total;
			state.totalToday = action.payload.totalToday;
		},
	},
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
