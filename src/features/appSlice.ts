import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Ingredient, SelectedIngredient} from "../types";
import {API} from "../api";

export const fetchIngredients = createAsyncThunk(
	"appSlice/fetchIngredients",
	async (_, { rejectWithValue }) => {
		try {
			return await API.getIngredients();
		} catch (error) {
			return rejectWithValue("Не удалось загрузить ингредиенты");
		}
	}
);

export const createOrder = createAsyncThunk(
	"appSlice/createOrder",
	async (ingredientIds: string[], { rejectWithValue }) => {
		try {
			return await API.createOrder(ingredientIds);
		} catch (error) {
			return rejectWithValue("Не удалось создать заказ");
		}
	}
);

interface OrderResponse {
	success: boolean;
	name: string;
	order: {
		number: number;
	};
}

interface ConstructorData {
	bun: SelectedIngredient | null;
	ingredients: SelectedIngredient[];
}

interface AppState {
	ingredients: Ingredient[];
	ingredientsStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
	ingredientsError: string | null;
	constructorData: ConstructorData;
	selectedIngredient: Ingredient | null;
	order: OrderResponse | null;
	orderStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
	orderError: string | null;
}

const initialState: AppState = {
	ingredients: [],
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

export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		addIngredientToConstructor: (state, action: PayloadAction<SelectedIngredient>) => {
			const ingredient = action.payload;
			if (ingredient.type === 'bun') {
				state.constructorData.bun = ingredient;
			} else {
				state.constructorData.ingredients.push(ingredient);
			}
		},
		removeIngredientFromConstructor: (state, action: PayloadAction<number>) => {
			state.constructorData.ingredients.splice(action.payload, 1);
		},
		moveIngredientInConstructor: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
			const { dragIndex, hoverIndex } = action.payload;
			const draggedItem = state.constructorData.ingredients[dragIndex];
			state.constructorData.ingredients.splice(dragIndex, 1);
			state.constructorData.ingredients.splice(hoverIndex, 0, draggedItem);
		},
		setSelectedIngredient: (state, action: PayloadAction<Ingredient | null>) => {
			state.selectedIngredient = action.payload;
		},
		clearConstructor: (state) => {
			state.constructorData = {
				bun: null,
				ingredients: [],
			};
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchIngredients.pending, (state) => {
				state.ingredientsStatus = 'pending';
				state.ingredientsError = null;
			})
			.addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<Ingredient[]>) => {
				state.ingredients = action.payload;
				state.ingredientsStatus = 'succeeded';
				state.ingredientsError = null;
			})
			.addCase(fetchIngredients.rejected, (state, action) => {
				state.ingredientsStatus = 'failed';
				state.ingredientsError = action.payload as string;
			})
			.addCase(createOrder.pending, (state) => {
				state.orderStatus = 'pending';
				state.orderError = null;
				state.order = null;
			})
			.addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
				state.order = action.payload;
				state.orderStatus = 'succeeded';
				state.orderError = null;
				state.constructorData = { bun: null, ingredients: [] };
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.orderStatus = 'failed';
				state.orderError = action.payload as string;
			});
	},
});

export const {
	addIngredientToConstructor,
	removeIngredientFromConstructor,
	moveIngredientInConstructor,
	setSelectedIngredient,
	clearConstructor,
} = appSlice.actions;

export default appSlice.reducer;