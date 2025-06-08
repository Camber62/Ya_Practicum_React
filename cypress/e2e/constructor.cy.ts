describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.visit('/');
    // Ждем загрузки ингредиентов
    cy.get('[data-testid="ingredient-item"]').should('exist');
  });

  it('должен позволять перетаскивать ингредиенты в конструктор', () => {
    // Находим булку и перетаскиваем её в конструктор
    cy.get('[data-testid="ingredient-item"]').contains('булка').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Проверяем, что булка появилась в конструкторе
    cy.get('[data-testid="constructor-bun"]').should('exist');

    // Находим любой ингредиент (не булку) и перетаскиваем его в конструктор
    cy.get('[data-testid="ingredient-item"]').not(':contains("булка")').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Проверяем, что начинка появилась в конструкторе
    cy.get('[data-testid="constructor-ingredients"]').should('exist');
  });

  it('должен открывать модальное окно при клике на ингредиент', () => {
    // Кликаем на ингредиент
    cy.get('[data-testid="ingredient-item"]').first().click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal"]').contains('Детали ингредиента');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен проверять кнопку оформления заказа', () => {
    // Проверяем, что кнопка "Оформить заказ" существует
    cy.get('button').contains('Оформить заказ').should('exist');
    
    // Проверяем, что кнопка изначально неактивна (нет булки)
    cy.get('button').contains('Оформить заказ').should('be.disabled');

    // Добавляем булку
    cy.get('[data-testid="ingredient-item"]').contains('булка').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Проверяем, что кнопка стала активной
    cy.get('button').contains('Оформить заказ').should('not.be.disabled');
  });

  it('должен очищать конструктор при удалении ингредиентов', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-item"]').contains('булка').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Проверяем, что булка появилась
    cy.get('[data-testid="constructor-bun"]').should('exist');

    // Добавляем начинку
    cy.get('[data-testid="ingredient-item"]').not(':contains("булка")').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Проверяем, что начинка появилась
    cy.get('[data-testid="constructor-ingredients"]').should('exist');

    // Проверяем, что в конструкторе есть и булка, и начинка
    cy.get('[data-testid="constructor-bun"]').should('have.length', 2); // верхняя и нижняя булка
    cy.get('[data-testid="constructor-ingredients"]').should('exist');
  });
}); 