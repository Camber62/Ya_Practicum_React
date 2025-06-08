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

    // Находим начинку и перетаскиваем её в конструктор
    cy.get('[data-testid="ingredient-item"]').contains('соус').first()
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

  it('должен создавать заказ при авторизованном пользователе', () => {
    // Логинимся
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();

    // Возвращаемся на главную
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.get('[data-testid="ingredient-item"]').should('exist');

    // Добавляем булку
    cy.get('[data-testid="ingredient-item"]').contains('булка').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Добавляем начинку
    cy.get('[data-testid="ingredient-item"]').contains('соус').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Нажимаем кнопку "Оформить заказ"
    cy.get('button').contains('Оформить заказ').click();

    // Проверяем, что открылось модальное окно с номером заказа
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal"]').contains('идентификатор заказа');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-testid="constructor-bun"]').should('not.exist');
    cy.get('[data-testid="constructor-ingredients"]').should('not.exist');
  });

  it('должен показывать ошибку при попытке создать заказ без авторизации', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-item"]').contains('булка').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Добавляем начинку
    cy.get('[data-testid="ingredient-item"]').contains('соус').first()
      .trigger('dragstart')
      .trigger('dragleave');
    
    cy.get('[data-testid="constructor-drop-target"]')
      .trigger('dragenter')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Нажимаем кнопку "Оформить заказ"
    cy.get('button').contains('Оформить заказ').click();

    // Проверяем, что появилось сообщение об ошибке
    cy.get('[data-testid="error-message"]').should('exist');
    cy.get('[data-testid="error-message"]').contains('Требуется авторизация');
  });
}); 