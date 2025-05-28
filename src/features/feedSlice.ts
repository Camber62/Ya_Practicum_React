import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const feedSlice = createSlice({
	name: 'feed',
	initialState,
	reducers: {
		wsConnect(state) {
			state.wsConnected = true;
			state.error = null;
		},
		wsDisconnect(state) {
			state.wsConnected = false;
		},
		wsError(state, action: PayloadAction<string>) {
			state.error = action.payload;
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
		wsClose(state) {
			state.wsConnected = false;
		},
	},
});

export const { wsConnect, wsDisconnect, wsError, wsMessage, wsClose } =
	feedSlice.actions;
export default feedSlice.reducer;
