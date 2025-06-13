/// <reference types="cypress" />

// Кастомные команды для работы с конструктором
Cypress.Commands.add(
	'dragIngredientToConstructor',
	(ingredientSelector: string) => {
		cy.get(ingredientSelector).trigger('dragstart').trigger('dragleave');

		cy.get('[data-testid="constructor-drop-target"]')
			.trigger('dragenter')
			.trigger('dragover')
			.trigger('drop')
			.trigger('dragend');
	}
);

Cypress.Commands.add('addBunToConstructor', () => {
	cy.get('[data-testid="ingredient-item"]')
		.contains('булка')
		.first()
		.as('bunIngredient');

	cy.get('@bunIngredient').then(($bun) => {
		cy.wrap($bun).trigger('dragstart').trigger('dragleave');

		cy.get('[data-testid="constructor-drop-target"]')
			.trigger('dragenter')
			.trigger('dragover')
			.trigger('drop')
			.trigger('dragend');
	});
});

Cypress.Commands.add('addFillingToConstructor', () => {
	cy.get('[data-testid="ingredient-item"]')
		.not(':contains("булка")')
		.first()
		.as('fillingIngredient');

	cy.get('@fillingIngredient').then(($filling) => {
		cy.wrap($filling).trigger('dragstart').trigger('dragleave');

		cy.get('[data-testid="constructor-drop-target"]')
			.trigger('dragenter')
			.trigger('dragover')
			.trigger('drop')
			.trigger('dragend');
	});
});

Cypress.Commands.add('openIngredientModal', () => {
	cy.get('[data-testid="ingredient-item"]')
		.first()
		.as('firstIngredient')
		.click();
});

Cypress.Commands.add('closeModal', () => {
	cy.get('[data-testid="modal-close-button"]').click();
});
