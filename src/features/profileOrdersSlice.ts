import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const profileOrdersSlice = createSlice({
	name: 'profileOrders',
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
				orders: ProfileOrder[];
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
	profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
