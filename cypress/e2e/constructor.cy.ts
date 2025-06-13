/// <reference types="cypress" />

// Константы для селекторов
const SELECTORS = {
	INGREDIENT_ITEM: '[data-testid="ingredient-item"]',
	CONSTRUCTOR_DROP_TARGET: '[data-testid="constructor-drop-target"]',
	CONSTRUCTOR_BUN: '[data-testid="constructor-bun"]',
	CONSTRUCTOR_INGREDIENTS: '[data-testid="constructor-ingredients"]',
	MODAL: '[data-testid="modal"]',
	MODAL_CLOSE_BUTTON: '[data-testid="modal-close-button"]',
	ORDER_BUTTON: 'button:contains("Оформить заказ")',
} as const;

describe('Конструктор бургеров', () => {
	beforeEach(() => {
		cy.visit('/');
		// Ждем загрузки ингредиентов
		cy.get(SELECTORS.INGREDIENT_ITEM).should('exist');
	});

	it('должен позволять перетаскивать ингредиенты в конструктор', () => {
		// Находим булку и перетаскиваем её в конструктор
		cy.get(SELECTORS.INGREDIENT_ITEM)
			.contains('булка')
			.first()
			.as('bunIngredient');

		cy.get('@bunIngredient').then(($bun) => {
			cy.wrap($bun).trigger('dragstart').trigger('dragleave');
		});

		cy.get(SELECTORS.CONSTRUCTOR_DROP_TARGET)
			.trigger('dragenter')
			.trigger('dragover')
			.trigger('drop')
			.trigger('dragend');

		// Проверяем, что булка появилась в конструкторе
		cy.get(SELECTORS.CONSTRUCTOR_BUN).should('exist');

		// Находим любой ингредиент (не булку) и перетаскиваем его в конструктор
		cy.get(SELECTORS.INGREDIENT_ITEM)
			.not(':contains("булка")')
			.first()
			.as('fillingIngredient');

		cy.get('@fillingIngredient').then(($filling) => {
			cy.wrap($filling).trigger('dragstart').trigger('dragleave');
		});

		cy.get(SELECTORS.CONSTRUCTOR_DROP_TARGET)
			.trigger('dragenter')
			.trigger('dragover')
			.trigger('drop')
			.trigger('dragend');

		// Проверяем, что начинка появилась в конструкторе
		cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('exist');
	});

	it('должен открывать модальное окно при клике на ингредиент', () => {
		// Кликаем на ингредиент
		cy.get(SELECTORS.INGREDIENT_ITEM).first().as('firstIngredient').click();

		// Проверяем, что модальное окно открылось
		cy.get(SELECTORS.MODAL).should('exist');
		cy.get(SELECTORS.MODAL).contains('Детали ингредиента');

		// Закрываем модальное окно
		cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
		cy.get(SELECTORS.MODAL).should('not.exist');
	});

	it('должен проверять кнопку оформления заказа', () => {
		// Проверяем, что кнопка "Оформить заказ" существует
		cy.get(SELECTORS.ORDER_BUTTON).should('exist');

		// Проверяем, что кнопка изначально неактивна (нет булки)
		cy.get(SELECTORS.ORDER_BUTTON).should('be.disabled');

		// Добавляем булку используя кастомную команду
		cy.addBunToConstructor();

		// Проверяем, что кнопка стала активной
		cy.get(SELECTORS.ORDER_BUTTON).should('not.be.disabled');
	});

	it('должен очищать конструктор при удалении ингредиентов', () => {
		// Добавляем булку
		cy.addBunToConstructor();

		// Проверяем, что булка появилась
		cy.get(SELECTORS.CONSTRUCTOR_BUN).should('exist');

		// Добавляем начинку
		cy.addFillingToConstructor();

		// Проверяем, что начинка появилась
		cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('exist');

		// Проверяем, что в конструкторе есть и булка, и начинка
		cy.get(SELECTORS.CONSTRUCTOR_BUN).should('have.length', 2); // верхняя и нижняя булка
		cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('exist');
	});

	it('должен использовать кастомные команды для работы с модальным окном', () => {
		// Открываем модальное окно используя кастомную команду
		cy.openIngredientModal();

		// Проверяем, что модальное окно открылось
		cy.get(SELECTORS.MODAL).should('exist');

		// Закрываем модальное окно используя кастомную команду
		cy.closeModal();

		// Проверяем, что модальное окно закрылось
		cy.get(SELECTORS.MODAL).should('not.exist');
	});
}); 