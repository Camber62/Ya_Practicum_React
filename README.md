# Ya_Practicum_React

Добро пожаловать в учебный проект React!

**Демо:** [https://camber62.github.io/Ya_Practicum_React/](https://camber62.github.io/Ya_Practicum_React/)

## О проекте

Это учебное приложение на React с использованием TypeScript, Redux Toolkit, React Router, Webpack и других современных технологий. Проект предназначен для практики и демонстрации навыков фронтенд-разработки.

## Быстрый старт

```bash
# Установите зависимости
npm install

# Запустите проект в режиме разработки
npm start

# Соберите проект для продакшена
npm run build

# Задеплойте на GitHub Pages
npm run deploy
```

## Деплой на GitHub Pages

- Сайт публикуется по адресу: https://camber62.github.io/Ya_Practicum_React/
- Для корректной работы роутинга используется `basename` в `BrowserRouter`.

## Важно для роутинга

- Главная страница и все маршруты работают только по адресу `/Ya_Practicum_React/`.
- Если вы видите 404 при обновлении страницы или при прямом переходе по ссылке — убедитесь, что путь начинается с `/Ya_Practicum_React/`.
- Для локальной разработки всё работает как обычно на `localhost:8080`.

## Структура проекта

```
├── src/                 # Исходный код
├── public/              # Статические файлы
├── dist/                # Собранный проект (создается после build)
├── webpack/             # Конфигурация webpack
└── .github/workflows/   # GitHub Actions для автодеплоя
```

## Технологии

- React 18
- TypeScript
- Redux Toolkit
- React Router
- Webpack 5
- SASS
- Jest + Testing Library
- Cypress

---