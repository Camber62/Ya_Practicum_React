import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebSocketActionTypes } from '../middleware/socketMiddleware';

export interface FeedOrder {
	_id: string;
	number: number;
	name: string;
	status: string;
	ingredients: string[];
	createdAt: string;
	updatedAt: string;
}

export interface FeedState {
	orders: FeedOrder[];
	total: number;
	totalToday: number;
	wsConnected: boolean;
	error: string | null;
}

const initialState: FeedState = {
	orders: [],
	total: 0,
	totalToday: 0,
	wsConnected: false,
	error: null,
};

export const FEED_WS_ACTIONS: WebSocketActionTypes = {
	connect: 'feed/wsConnect',
	disconnect: 'feed/wsDisconnect',
	connecting: 'feed/wsConnecting',
	open: 'feed/wsOpen',
	close: 'feed/wsClose',
	error: 'feed/wsError',
	message: 'feed/wsMessage',
};

const feedSlice = createSlice({
	name: 'feed',
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
				orders: FeedOrder[];
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

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } = feedSlice.actions;
export default feedSlice.reducer;
