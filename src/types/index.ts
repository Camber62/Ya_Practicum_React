// src/types/index.ts

// Интерфейс для ингредиента
export interface Ingredient {
	_id: string;
	name: string;
	type: 'bun' | 'sauce' | 'main';
	proteins: number;
	fat: number;
	carbohydrates: number;
	calories: number;
	price: number;
	image: string;
	image_mobile: string;
	image_large: string;
	__v: number;
}

// Интерфейс для выбранного ингредиента с уникальным идентификатором
export interface SelectedIngredient extends Ingredient {
	uniqueId: string;
}

// Интерфейс для пропсов компонента BurgerConstructor
export interface BurgerConstructorProps {
	selectedIngredients: SelectedIngredient[];
	onAddIngredient: (ingredient: Ingredient) => void;
	onRemoveIngredient: (index: number) => void;
	onMoveIngredient: (dragIndex: number, hoverIndex: number) => void;
}

// Интерфейс для пропсов компонента BurgerIngredients
export interface BurgerIngredientsProps {
	ingredients: Ingredient[];
	selectedIngredients: Ingredient[];
	onAddIngredient?: (ingredient: Ingredient) => void; // Опционально, так как в одном из вариантов BurgerIngredients есть этот пропс
}

// Интерфейс для пропсов компонента IngredientDetails
export interface IngredientDetailsProps {
	ingredient: Ingredient;
}

// Интерфейс для пропсов компонента Modal
export interface ModalProps {
	title?: string;
	onClose: () => void;
	children: React.ReactNode;
}

// Интерфейс для пропсов компонента ModalOverlay
export interface ModalOverlayProps {
	onClose: () => void;
}
