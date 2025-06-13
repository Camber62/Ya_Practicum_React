/// <reference types="cypress" />

declare global {
	namespace Cypress {
		interface Chainable {
			dragIngredientToConstructor(
				ingredientSelector: string
			): Chainable<Element>;
			addBunToConstructor(): Chainable<Element>;
			addFillingToConstructor(): Chainable<Element>;
			openIngredientModal(): Chainable<Element>;
			closeModal(): Chainable<Element>;
		}
	}
}

export {};
